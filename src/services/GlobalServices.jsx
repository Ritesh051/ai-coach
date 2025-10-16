import axios from "axios";
import OpenAI from "openai";
import { ExpertsList } from "./Options";

export const getToken = async () => {
  const result = await axios.get("/api/getToken");
  return result.data;
};

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true,
});

export const AIModel = async (topic, coachOptions, userMessage) => {
  const option = ExpertsList.find(opt => opt.name === coachOptions);
  const PROMPT = option ? option.prompt : "You are a helpful AI assistant.";

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [
        {
          role: "assistant",
          content: `${PROMPT}\n\nTopic: ${topic}\n\nProvide concise, helpful responses during this conversation.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiText = completion.choices?.[0]?.message?.content?.trim() || "No response";
    return aiText;
  } catch (error) {
    console.error("AIModel error:", error);
    return "I apologize, but I'm having trouble responding right now. Please continue.";
  }
};

export const AIModelToGenerateFeedbackAndNotes = async (coachOptions, conversation) => {
  const option = ExpertsList.find(opt => opt.name === coachOptions);
  const PROMPT = option ? option.summaryPrompt : "Generate helpful feedback and concise notes.";

  try {
    const safeConversation = Array.isArray(conversation) ? conversation : [];
    const conversationText = safeConversation
      .map((turn, idx) => {
        return `Turn ${idx + 1}:\nUser: ${turn.userMessage}\nAI: ${turn.aiResponse}`;
      })
      .join("\n\n");


    const completion = await openai.chat.completions.create({
      /*meta-llama/llama-3.3-8b-instruct:free
      1. google/gemini-2.0-flash-exp:free
      2. mistralai/mistral-7b-instruct:free
      3. deepseek/deepseek-r1-0528-qwen3-8b:free
      4. deepseek/deepseek-chat-v3.1:free 
      5. alibaba/tongyi-deepresearch-30b-a3b:free
      */
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [
        {
          role: "assistant",
          content: PROMPT,
        },
        {
          role: "user",
          content: `Here is the conversation:\n\n${conversationText}\n\nPlease provide a detailed feedback summary and short, well-structured notes based on the above discussion.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiText = completion.choices?.[0]?.message?.content?.trim() || "No response";
    return aiText;
  } catch (error) {
    console.error("AIModelToGenerateFeedbackAndNotes error:", error);
    return "Error: Could not generate AI feedback or notes.";
  }
};