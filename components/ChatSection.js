'use client'

import { useState, useRef, useEffect } from 'react'
import TopicSelection from './TopicSelection'

export default function ChatSection() {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleStartInterview = (topic) => {
    setCurrentTopic(topic);
    setIsInterviewStarted(true);
    
    // Add initial message from the AI interviewer
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `Let's start your interview on ${topic}. Tell me about your experience in this field.`
      }
    ]);
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses = [
        "That's interesting! Can you elaborate on that?",
        "How would you approach a challenging problem in this area?",
        "What frameworks or methodologies do you typically use?",
        "Tell me about a project where you demonstrated expertise in this topic.",
        "What do you think are the biggest challenges in this field?"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const newAiMessage = {
        id: Date.now(),
        sender: 'ai',
        text: randomResponse
      };
      
      setMessages(prev => [...prev, newAiMessage]);
    }, 1000);
  };
  
  if (!isInterviewStarted) {
    return <TopicSelection onStartInterview={handleStartInterview} />;
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-700">
      <div className="bg-gray-800/80 p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.687-.1-1.016A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
          Interview: <span className="ml-2 text-indigo-300">{currentTopic}</span>
        </h2>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-gray-900/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] mb-4 ${
              message.sender === 'user' ? 'ml-auto' : 'mr-auto'
            }`}
          >
            <div
              className={`p-3 rounded-xl ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-lg'
                  : 'bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600 shadow-lg'
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-500 mt-1 mx-1">
              {message.sender === 'user' ? 'You' : 'AI Interviewer'} • just now
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-700 bg-gray-800/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your answer..."
            className="flex-grow bg-gray-700/50 border border-gray-600 text-gray-100 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-all shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center"
          >
            <span>Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
