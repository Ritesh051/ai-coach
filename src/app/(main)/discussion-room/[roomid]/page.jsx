"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import { AIModel, AIModelToGenerateFeedbackAndNotes, getToken } from "@/services/GlobalServices";
import { AiExpertsList } from "@/services/Options";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

export default function Page() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.InterviewRoom.GetDiscussionRoom, { id: roomid });
  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [accumulatedText, setAccumulatedText] = useState("");
  const [aiResponses, setAiResponses] = useState([]);
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
  const [feedbackAndNotes, setFeedbackAndNotes] = useState("");
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const updateConversation = useMutation(api.InterviewRoom.updateDiscussionRoom);
  const updateSummary = useMutation(api.InterviewRoom.updateSummary);
  const accumulationTimerRef = useRef(null);

  const mediaStreamRef = useRef(null);
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    if (DiscussionRoomData) {
      const expertDetails = AiExpertsList.find((item) => item.name === DiscussionRoomData.expertName);
      setExpert(expertDetails);
    }
  }, [DiscussionRoomData]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts, currentTranscript]);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (wsRef.current) {
        try { wsRef.current.close(); } catch (e) { }
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) { }
      }
      if (accumulationTimerRef.current) {
        clearTimeout(accumulationTimerRef.current);
      }
    };
  }, []);

  const saveConversation = async (transcriptsList, aiResponsesList) => {
    try {
      await updateConversation({
        id: DiscussionRoomData._id,
        conversation: transcriptsList.map((t, idx) => ({
          userMessage: t.text,
          userTimestamp: t.timestamp,
          userConfidence: t.confidence,
          turnOrder: t.turnOrder,
          aiResponse: aiResponsesList[idx]?.aiText || "",
          aiTimestamp: aiResponsesList[idx]?.timestamp || "",
        }))
      });
      console.log("Conversation saved successfully");
    } catch (error) {
      console.error("Failed to save conversation:", error);
    }
  };

  const saveSummaryToDatabase = async (summaryText) => {
    try {
      await updateSummary({
        id: DiscussionRoomData._id,
        summary: summaryText,
      }); 
      toast('Summary saved successfully', { type: 'success' });
      console.log("Summary saved to database successfully");
    } catch (error) {
      console.error("Failed to save summary:", error);
      toast('Failed to save summary', { type: 'error' });
      throw error;
    }
  };


  const generateFeedbackAndNotes = async () => {
    if (transcripts.length === 0) {
      alert("No conversation to generate feedback from!");
      return;
    }

    setIsGeneratingFeedback(true);
    try {
      const conversationData = transcripts.map((t, idx) => ({
        userMessage: t.text,
        aiResponse: aiResponses[idx]?.aiText || "",
      }));

      console.log("Generating feedback for conversation...");
      const feedback = await AIModelToGenerateFeedbackAndNotes(
        DiscussionRoomData.coachOptions,
        conversationData
      );

      setFeedbackAndNotes(feedback);
      await saveSummaryToDatabase(feedback);

      console.log("Feedback generated and saved successfully");
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedbackAndNotes("Error: Could not generate feedback. Please try again.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const connectToServer = async () => {
    if (isLoading || enableMic) return;
    setIsLoading(true);

    try {
      const tokenData = await getToken();
      const token = tokenData?.token ?? tokenData;

      if (!token || typeof token !== 'string') {
        throw new Error("Invalid token format received");
      }

      const sampleRate = 16000;
      const wsUrl = `wss://streaming.assemblyai.com/v3/ws?sample_rate=${sampleRate}&format_turns=true&token=${encodeURIComponent(token)}`;

      console.log("Connecting to AssemblyAI Streaming v3...");
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected successfully!");
      };

      ws.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        console.log("Message received:", data);

        if (data.type === "SessionBegins" || data.type === "Begin") {
          console.log("Session started successfully");
          setTranscripts([]);
          setCurrentTranscript("");
          setAiResponses([]);
          setAccumulatedText("");
          setFeedbackAndNotes("");
        } else if (data.type === "Turn" && data.transcript) {
          const formatted = data.turn_is_formatted;

          if (formatted) {
            if (accumulationTimerRef.current) {
              clearTimeout(accumulationTimerRef.current);
            }

            const newText = accumulatedText ? accumulatedText + " " + data.transcript : data.transcript;
            setAccumulatedText(newText);
            setCurrentTranscript("");

            accumulationTimerRef.current = setTimeout(async () => {
              if (newText.trim()) {
                try {
                  const aiResponseText = await AIModel(
                    DiscussionRoomData.topic,
                    DiscussionRoomData.coachOptions,
                    newText
                  );

                  const newTranscript = {
                    text: newText,
                    timestamp: new Date().toLocaleTimeString(),
                    confidence: data.end_of_turn_confidence,
                    turnOrder: data.turn_order,
                  };

                  const newAiResponse = {
                    aiText: aiResponseText,
                    timestamp: new Date().toLocaleTimeString(),
                  };

                  setTranscripts(prev => {
                    const updated = [...prev, newTranscript];
                    return updated;
                  });

                  setAiResponses(prev => {
                    const updated = [...prev, newAiResponse];
                    return updated;
                  });

                  setAccumulatedText("");

                  setTimeout(async () => {
                    setTranscripts(currentTranscripts => {
                      setAiResponses(currentAiResponses => {
                        saveConversation(currentTranscripts, currentAiResponses);
                        return currentAiResponses;
                      });
                      return currentTranscripts;
                    });
                  }, 100);

                } catch (error) {
                  console.error("Error getting AI response:", error);
                }
              }
            }, 5000);
          } else {
            setCurrentTranscript(data.transcript);
          }
        }
        else if (data.type === "error") {
          console.error("WebSocket error:", data.error);
        } else if (data.type === "Termination") {
          console.log("Session terminated:", data);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      ws.onclose = (ev) => {
        console.log("WebSocket closed:", ev.code, ev.reason);
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: sampleRate,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      mediaStreamRef.current = stream;

      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextCtor({ sampleRate: sampleRate });
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const bufferSize = 4096;
      const processor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        try {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16Buffer = floatTo16BitPCM(inputData);
          wsRef.current.send(pcm16Buffer);
        } catch (err) {
          console.error("Error processing audio:", err);
        }
      };
      source.connect(processor);
      processor.connect(audioCtx.destination);

      setEnableMic(true);
      console.log("Recording started and streaming audio");
    } catch (err) {
      console.error("Connection failed:", err);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (wsRef.current) {
        try { wsRef.current.close(); } catch (e) { }
        wsRef.current = null;
      }
      setEnableMic(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromServer = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (accumulationTimerRef.current) {
        clearTimeout(accumulationTimerRef.current);
        accumulationTimerRef.current = null;
      }
      let finalTranscripts = [...transcripts];
      let finalAiResponses = [...aiResponses];

      if (accumulatedText.trim()) {
        console.log("Processing final accumulated text:", accumulatedText);

        try {
          const lastAiResponse = await AIModel(
            DiscussionRoomData.topic,
            DiscussionRoomData.coachOptions,
            accumulatedText
          );

          finalTranscripts.push({
            text: accumulatedText,
            timestamp: new Date().toLocaleTimeString(),
            confidence: null,
            turnOrder: null,
          });

          finalAiResponses.push({
            aiText: lastAiResponse,
            timestamp: new Date().toLocaleTimeString(),
          });
          setTranscripts(finalTranscripts);
          setAiResponses(finalAiResponses);
        } catch (error) {
          console.error("Error processing final text:", error);
        }
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      if (audioCtxRef.current) {
        try {
          await audioCtxRef.current.close();
        } catch (e) {
          console.error("Error closing audio context:", e);
        }
        audioCtxRef.current = null;
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: "Terminate" }));
        } catch (e) {
          console.error("Error sending terminate:", e);
        }

        setTimeout(() => {
          try {
            wsRef.current.close();
          } catch (err) {
            console.error("Error closing WebSocket:", err);
          }
          wsRef.current = null;
        }, 100);
      }
      if (finalTranscripts.length > 0) {
        await saveConversation(finalTranscripts, finalAiResponses);
      }
      setEnableFeedbackNotes(true);

      setEnableMic(false);
      setAccumulatedText("");
      console.log("Disconnected from server and saved conversation");

    } catch (error) {
      console.error("Error during disconnect:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-base font-semibold">{DiscussionRoomData?.coachOptions}</h2>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            {expert?.avatar ? (
              <Image
                src={expert.avatar}
                alt="Avatar"
                width={200}
                height={200}
                className={`rounded-full h-[80px] w-[80px] object-cover ${enableMic ? "animate-pulse" : ""}`}
              />
            ) : (
              <div className={`rounded-full h-[80px] w-[80px] bg-gray-300 flex items-center justify-center ${enableMic ? "animate-pulse" : ""}`}>
                <span className="text-2xl">👤</span>
              </div>
            )}
            <h2 className="text-gray-500 mt-2">{expert?.name}</h2>

            {enableMic && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Recording...</span>
              </div>
            )}

            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10 pointer-events-none">
              <UserButton />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer} disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect"}
              </Button>
            ) : (
              <Button variant="destructive" onClick={disconnectFromServer} disabled={isLoading}>
                {isLoading ? "Disconnecting..." : "Disconnect"}
              </Button>
            )}
          </div>

          {/* Feedback and Notes Section */}
          {enableFeedbackNotes && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback & Notes</CardTitle>
                  <CardDescription>
                    AI-generated insights from your conversation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!feedbackAndNotes ? (
                    <div className="text-center py-8">
                      <Button
                        onClick={generateFeedbackAndNotes}
                        disabled={isGeneratingFeedback || transcripts.length === 0}
                        className="w-full"
                      >
                        {isGeneratingFeedback ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Feedback...
                          </>
                        ) : (
                          "Generate Feedback & Notes"
                        )}
                      </Button>
                      {transcripts.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                          No conversation to analyze yet
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {feedbackAndNotes}
                        </div>
                      </div>
                      <Button
                        onClick={generateFeedbackAndNotes}
                        variant="outline"
                        disabled={isGeneratingFeedback}
                        className="w-full"
                      >
                        {isGeneratingFeedback ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Regenerating...
                          </>
                        ) : (
                          "Regenerate Feedback"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div>
          <div className="h-[60vh] bg-gradient-to-b from-gray-50 to-gray-100 border rounded-3xl shadow-inner flex flex-col p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Live Chat</h2>
              <div className="flex items-center gap-2">
                {enableMic && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                <span className="text-xs text-gray-500">
                  {enableMic ? "Listening..." : enableFeedbackNotes ? "Notes Ready" : "Offline"}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {transcripts.length === 0 && !currentTranscript && (
                <p className="text-gray-400 text-sm text-center mt-10 italic">
                  Start speaking to see your conversation appear here ✨
                </p>
              )}

              {transcripts.map((transcript, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-blue-500 text-white p-3 rounded-2xl rounded-tr-sm shadow-md">
                      <p className="text-sm leading-relaxed">{transcript.text}</p>
                      <div className="flex items-center justify-end mt-1 gap-2 text-xs opacity-70">
                        {transcript.confidence && (
                          <span>{Math.round(transcript.confidence * 100)}%</span>
                        )}
                        <span>{transcript.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {aiResponses[index] && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-sm shadow-sm">
                        <p className="text-sm font-medium text-green-700 mb-1">
                          {expert?.name || "AI"}:
                        </p>
                        <p className="text-sm leading-relaxed text-gray-700">
                          {aiResponses[index].aiText}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {aiResponses[index].timestamp}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {currentTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-blue-100 text-gray-700 p-3 rounded-2xl rounded-tr-sm shadow-sm">
                    <p className="text-sm italic">{currentTranscript}</p>
                    <span className="text-xs text-blue-500 mt-1 block">Transcribing...</span>
                  </div>
                </div>
              )}

              {accumulatedText && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-yellow-50 text-yellow-800 p-3 rounded-2xl rounded-tr-sm shadow-sm border border-yellow-200">
                    <p className="text-sm">{accumulatedText}</p>
                    <span className="text-xs text-yellow-600 mt-1 block">Processing...</span>
                  </div>
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>
          </div>

          <h2 className="mt-4 text-sm text-gray-600">
            At the end of your conversation we will automatically generate feedback and notes from your conversation.
          </h2>
        </div>
      </div>
    </div>
  );
}