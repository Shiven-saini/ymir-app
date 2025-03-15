// components/interview/MessageInput.jsx
'use client'

import { useState } from 'react';

export default function MessageInput({ onSendMessage, isLoading, isDisabled, placeholder = "Type your answer..." }) {
  const [inputValue, setInputValue] = useState('');
  
  const handleSend = () => {
    if (inputValue.trim() === '' || isLoading || isDisabled) return;
    onSendMessage(inputValue);
    setInputValue('');
  };
  
  return (
    <div className="p-4 border-t border-zinc-800 bg-black">
      <div className="relative">
        <div className={`flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden ${isLoading || isDisabled ? 'opacity-50' : 'focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent'}`}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isLoading ? "Waiting..." : isDisabled ? "Interview completed" : placeholder}
            className="flex-grow bg-transparent text-zinc-100 py-3 px-4 focus:outline-none"
            disabled={isLoading || isDisabled}
          />
          
          <button 
            className="p-2 text-zinc-400 hover:text-orange-400 focus:outline-none transition-colors"
            title="Voice input (coming soon)"
            disabled={isLoading || isDisabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={handleSend}
            disabled={inputValue.trim() === '' || isLoading || isDisabled}
            className={`p-3 focus:outline-none transition-colors ${
              inputValue.trim() === '' || isLoading || isDisabled ? 'text-zinc-600' : 'text-orange-500 hover:text-orange-400'
            }`}
            title="Send message"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
