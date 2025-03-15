// components/interview/CompletionDialog.jsx
'use client'

import { useState } from 'react';

export default function CompletionDialog({ assessment, onRestart }) {
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-6 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <svg className="w-20 h-20 text-green-500" viewBox="0 0 24 24">
            <path 
              fill="currentColor" 
              d="M12,0A12,12,0,1,0,24,12,12,12,0,0,0,12,0Zm6.93,8.2-6.85,9.28a1,1,0,0,1-1.43.1L5.76,13.26a1,1,0,0,1-.15-1.41A1,1,0,0,1,7,11.71l4.08,3.61L17.7,7.11a1,1,0,0,1,1.39-.19A1,1,0,0,1,18.93,8.2Z"
            >
              <animate 
                attributeName="opacity" 
                from="0" 
                to="1" 
                dur="0.8s" 
                begin="0s" 
                fill="freeze" 
              />
            </path>
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-center text-zinc-100 mb-2">
          Interview Completed!
        </h3>
        
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-orange-500 mb-1">
            {assessment?.overallScore || 0}/100
          </div>
          <p className="text-zinc-300">{assessment?.summary || "Thank you for completing the interview."}</p>
        </div>
        
        {!showDetailedFeedback ? (
          <button
            onClick={() => setShowDetailedFeedback(true)}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 py-3 rounded-lg mt-2 hover:bg-zinc-700 transition-all"
          >
            Show Detailed Feedback
          </button>
        ) : (
          <div className="mt-4 max-h-60 overflow-y-auto custom-scrollbar">
            {assessment?.questionAssessments.map((qa, index) => (
              <div key={index} className="mb-3 border-b border-zinc-800 pb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-400">Question {qa.questionNumber}</span>
                  <span className="text-orange-500 font-semibold">{qa.score}/10</span>
                </div>
                <p className="text-zinc-300 text-sm">{qa.feedback}</p>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={onRestart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg mt-4 transition-all"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
}
