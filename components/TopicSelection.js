'use client'

import { useState } from 'react'

const commonTopics = [
  "Software Engineering",
  "Data Science",
  "Product Management",
  "UX Design",
  "Machine Learning",
  "Web Development",
  "DevOps",
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
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-700">
      <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Select Interview Topic
      </h2>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {commonTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicSelect(topic)}
            className="bg-gray-700/60 text-gray-200 py-3 px-4 rounded-lg text-left font-medium transition-all hover:bg-indigo-600/30 hover:text-white hover:shadow-[0_0_10px_rgba(79,70,229,0.2)] border border-gray-600 hover:border-indigo-500"
          >
            {topic}
          </button>
        ))}
      </div>
      
      {!showCustomInput ? (
        <button
          onClick={() => setShowCustomInput(true)}
          className="w-full bg-gray-700/30 border border-gray-600 text-gray-300 py-3 px-4 rounded-lg mt-2 hover:bg-gray-700/60 hover:text-white transition-all flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
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
            className="w-full bg-gray-700/30 border border-gray-600 text-gray-200 rounded-lg py-3 px-4 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleCustomTopicSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            Start Interview
          </button>
        </div>
      )}
    </div>
  );
}
