'use client'

import WebcamSection from '../components/WebcamSection'
import ChatSection from '../components/ChatSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-gray-100">
      <div className="absolute w-full h-full inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10 pointer-events-none"></div>
      <div className="container mx-auto py-8 px-4 relative">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 mb-2 inline-block">
            AI Mock Interview Assistant
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">Desription doesn't really matter at this moment of development.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <WebcamSection />
          </div>
          
          <div className="flex flex-col h-[650px]">
            <ChatSection />
          </div>
        </div>
      </div>
    </main>
  );
}
