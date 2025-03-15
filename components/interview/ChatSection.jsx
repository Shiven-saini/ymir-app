// components/interview/ChatSection.jsx
'use client'

import { useEffect } from 'react';
import TopicSelection from './TopicSelection';
import InterviewProgress from './InterviewProgress';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import CompletionDialog from './CompletionDialog';
import useInterview from '../../hooks/useInterview';
import useMessages from '../../hooks/useMessages';

export default function ChatSection() {
  const {
    isInterviewStarted,
    currentTopic,
    questions,
    currentQuestionIndex,
    isLoading,
    interviewCompleted,
    assessment,
    startInterview,
    saveAnswer,
    startAssessment,
    resetInterview
  } = useInterview();
  
  const {
    messages,
    messagesEndRef,
    addMessage,
    clearMessages
  } = useMessages();
  
  const handleStartInterview = async (topic) => {
    addMessage({
      sender: 'ai',
      text: `Preparing your interview on ${topic}. Please wait while I generate questions...`,
      isTyping: true
    });
    
    const questions = await startInterview(topic);
    
    clearMessages();
    addMessage({
      sender: 'ai',
      text: `Let's start your interview on ${topic}. I'll ask you 10 questions to test your knowledge.`,
      isTyping: false
    });
    
    addMessage({
      sender: 'ai',
      text: questions[0],
      isTyping: false
    });
  };
  
  const handleSendMessage = (text) => {
    addMessage({
      sender: 'user',
      text: text
    });
    
    const isLastQuestion = saveAnswer(text);
    
    if (isLastQuestion) {
      addMessage({
        sender: 'ai',
        text: "Thank you for completing the interview! I'm now evaluating your answers...",
        isTyping: true
      });
      
      startAssessment();
    } else {
      setTimeout(() => {
        addMessage({
          sender: 'ai',
          text: questions[currentQuestionIndex + 1]
        });
      }, 1000);
    }
  };
  
  if (!isInterviewStarted) {
    return <TopicSelection onStartInterview={handleStartInterview} />;
  }
  
  return (
    <div className="flex flex-col h-[700px] bg-zinc-900 rounded-lg shadow-md overflow-hidden border border-zinc-800">
      <div className="bg-black p-4 border-b border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.687-.1-1.016A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
          Interview: <span className="ml-2 text-orange-400">{currentTopic}</span>
        </h2>
        
        {questions.length > 0 && !interviewCompleted && (
          <InterviewProgress 
            currentQuestionIndex={currentQuestionIndex} 
            totalQuestions={questions.length} 
          />
        )}
      </div>
      
      <MessageList 
        messages={messages} 
        messagesEndRef={messagesEndRef}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isDisabled={interviewCompleted}
        placeholder="Type your answer..."
      />
      
      {interviewCompleted && assessment && (
        <CompletionDialog 
          assessment={assessment} 
          onRestart={resetInterview}
        />
      )}
    </div>
  );
}
