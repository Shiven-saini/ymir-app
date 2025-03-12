'use client'

import { useState, useRef, useEffect } from 'react'

export default function WebcamSection() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [warnings, setWarnings] = useState([]);
  
  // Mock function to simulate detecting multiple people
  const simulateMultiplePersonDetection = () => {
    if (Math.random() > 0.7) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      setWarnings(prev => [...prev, {
        id: Date.now(),
        message: "Multiple people detected in frame",
        timestamp
      }]);
    }
  };

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
        
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        const interval = setInterval(simulateMultiplePersonDetection, 3000);
        return () => {
          clearInterval(interval);
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        };
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
    
    enableStream();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="relative rounded-xl overflow-hidden shadow-[0_0_15px_rgba(31,209,249,0.15)] border border-gray-800">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="w-full h-auto min-h-[420px] bg-gray-900 rounded-xl"
        />
        <div className="absolute bottom-4 right-4">
          <div className="bg-gray-900/80 backdrop-blur-sm text-emerald-400 px-3 py-1 rounded-full text-sm border border-emerald-500/30 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Live
          </div>
        </div>
      </div>
      
      {/* Proctoring Warnings */}
      <div className="mt-4 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-700">
        <h3 className="text-lg font-medium text-gray-200 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
          </svg>
          Proctoring Warnings
        </h3>
        {warnings.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-gray-400 text-sm bg-gray-800/30 rounded-lg border border-gray-700">
            No warnings detected
          </div>
        ) : (
          <div className="max-h-[150px] overflow-y-auto custom-scrollbar">
            {warnings.map(warning => (
              <div key={warning.id} className="bg-red-900/20 border-l-4 border-red-500 p-3 mb-2 rounded-r-lg">
                <div className="flex justify-between items-center">
                  <p className="text-red-400">{warning.message}</p>
                  <span className="text-gray-400 text-xs">{warning.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
