"use client";
import React from 'react';
import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../../convex/_generated/api';
import Image from 'next/image';
import { ExpertsList } from '@/services/Options';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Download, Share2, MessageCircle, Sparkles, TrendingUp, Award } from 'lucide-react';
import moment from 'moment';

function ViewSummary() {
  const { roomid } = useParams();
  const router = useRouter();
  const DiscussionRoomData = useQuery(api.InterviewRoom.GetDiscussionRoom, { id: roomid });

  const GetAbstractImages = (option) => {
    const coachingOption = ExpertsList.find((item) => item.name === option);
    return coachingOption?.abstract ?? '/ab1.png';
  };

  const GetExpertDetails = (option) => {
    return ExpertsList.find((item) => item.name === option);
  };

  if (!DiscussionRoomData) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Loading session details...</p>
        </div>
      </div>
    );
  }

  const expert = GetExpertDetails(DiscussionRoomData?.coachOptions);
  const hasConversation = DiscussionRoomData?.conversation && DiscussionRoomData.conversation.length > 0;
  const hasSummary = DiscussionRoomData?.summary;

  const totalWords = DiscussionRoomData?.conversation?.reduce(
    (sum, turn) => sum + turn.userMessage.split(' ').length, 0
  ) || 0;

  const avgConfidence = hasConversation 
    ? DiscussionRoomData.conversation.reduce((sum, turn) => sum + (turn.userConfidence || 0), 0) / DiscussionRoomData.conversation.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Header */}
      <div className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="bg-gray-100 dark:bg-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4 dark:text-white" />
              Back to History
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" className="hidden sm:flex items-center gap-2 dark:bg-gray-800">
                <Download className="h-4 w-4 dark:text-white" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Session Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="relative px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 sm:-mt-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-50"></div>
                <Image
                  className="relative rounded-2xl h-28 w-28 sm:h-32 sm:w-32 object-cover ring-4 ring-white shadow-2xl"
                  src={GetAbstractImages(DiscussionRoomData?.coachOptions)}
                  alt="Session"
                  width={128}
                  height={128}
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-2 ring-4 ring-white shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
                  <Award className="h-4 w-4" />
                  {DiscussionRoomData?.coachOptions}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {DiscussionRoomData?.topic}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{moment(DiscussionRoomData?._creationTime).format('MMMM Do, YYYY')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{DiscussionRoomData?.conversation?.length || 0} exchanges</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700">
                    {DiscussionRoomData?.conversation?.length || 0}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">
                    Total Exchanges
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="text-3xl font-bold text-purple-700">
                    {avgConfidence > 0 ? `${Math.round(avgConfidence * 100)}%` : '0%'}
                  </div>
                  <div className="text-xs text-purple-600 font-medium mt-1">
                    Avg. Confidence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversation Transcript */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-1">
            <div className="bg-white rounded-3xl h-full">
              <div className="sticky top-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-3xl px-6 py-5 border-b border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Conversation Transcript</h2>
                    <p className="text-sm text-gray-600">Your complete discussion with {expert?.name}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 h-[calc(100vh-400px)] overflow-y-auto">
                {!hasConversation ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageCircle className="h-20 w-20 mb-4 opacity-20" />
                    <p className="text-center text-lg font-medium">No conversation recorded yet</p>
                    <p className="text-sm text-center mt-2">Start a session to see your conversation here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {DiscussionRoomData.conversation.map((turn, index) => (
                      <div key={index} className="space-y-4">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="max-w-[80%]">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-3xl rounded-tr-lg shadow-lg">
                              <p className="text-sm leading-relaxed mb-2">{turn.userMessage}</p>
                              <div className="flex items-center justify-end gap-3 text-xs opacity-90">
                                {turn.userConfidence && (
                                  <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                                    {Math.round(turn.userConfidence * 100)}% confident
                                  </span>
                                )}
                                <span className="font-medium">{turn.userTimestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Response */}
                        {turn.aiResponse && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%]">
                              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-4 rounded-3xl rounded-tl-lg shadow-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                                    <Sparkles className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                                    {expert?.name || "AI Coach"}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700 mb-2">
                                  {turn.aiResponse}
                                </p>
                                <span className="text-xs text-gray-400 font-medium">
                                  {turn.aiTimestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Feedback & Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-1">
            <div className="bg-white rounded-3xl h-full">
              <div className="sticky top-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-3xl px-6 py-5 border-b border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI Feedback & Insights</h2>
                    <p className="text-sm text-gray-600">Personalized analysis of your session</p>
                  </div>
                </div>
              </div>

              <div className="p-6 h-[calc(100vh-400px)] overflow-y-auto">
                {!hasSummary ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <TrendingUp className="h-20 w-20 mb-4 opacity-20" />
                    <p className="text-center text-lg font-medium mb-2">No feedback generated yet</p>
                    <p className="text-sm text-center text-gray-500 max-w-xs">
                      Complete your session and generate feedback to see detailed insights here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {DiscussionRoomData.summary.split('\n\n').map((section, idx) => {
                      const isHeading = section.startsWith('**') || section.startsWith('###') || section.includes('**');
                      
                      return (
                        <div 
                          key={idx}
                          className={`
                            ${isHeading 
                              ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200' 
                              : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
                            }
                            p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200
                          `}
                        >
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {section}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Performance Metrics */}
                    {totalWords > 0 && (
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-2xl border border-emerald-200">
                          <div className="text-3xl font-bold text-emerald-700 mb-1">
                            {totalWords}
                          </div>
                          <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
                            Words Spoken
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-2xl border border-amber-200">
                          <div className="text-3xl font-bold text-amber-700 mb-1">
                            {Math.ceil(totalWords / 150)}
                          </div>
                          <div className="text-xs text-amber-600 font-semibold uppercase tracking-wide">
                            Minutes
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2"
          >
            View All Sessions
          </Button>
          <Button 
            size="lg"
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ViewSummary;