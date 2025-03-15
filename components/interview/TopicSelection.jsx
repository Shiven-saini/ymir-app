'use client'

import { useState } from 'react'

const commonTopics = [
  "Machine Learning",
  "Data Science",
  "Digital Electronics",
  "Internet of Things",
  "Android Development",
  "Web Development",
  "Software Engineering",
  "Cloud Computing"
];

export default function TopicSelection({ onStartInterview }) {
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const handleTopicSelect = (topic) => {
    onStartInterview(topic);
  };
  
  const handleCustomTopicSubmit = () => {
    if (customTopic.trim()) {
      onStartInterview(customTopic);
    }
  };
  
  return (
    <div className="bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Select Interview Topic
      </h2>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {commonTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicSelect(topic)}
            className="bg-zinc-800 text-zinc-200 py-3 px-4 rounded-lg text-left font-medium transition-all hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500/30"
          >
            {topic}
          </button>
        ))}
      </div>
      
      {!showCustomInput ? (
        <button
          onClick={() => setShowCustomInput(true)}
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 py-3 px-4 rounded-lg mt-2 hover:bg-zinc-700 transition-all flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Custom Topic
        </button>
      ) : (
        <div className="mt-2">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Enter custom topic..."
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg py-3 px-4 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={handleCustomTopicSubmit}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-all"
          >
            Start Interview
          </button>
        </div>
      )}
    </div>
  );
}
