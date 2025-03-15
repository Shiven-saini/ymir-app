'use client'

import WebcamSection from '../components/WebcamSection'
import ChatSection from '../components/interview/ChatSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto py-8 px-4 relative">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 mb-2">
              Yet Another AI Mock Interview Revision Assistant
            </h1>
            <p className="text-zinc-400 max-w-xl">
              Perfect your interview skills with Shiven's personal implementation of MIRA.
            </p>
          </div>
          
          {/* Copyright notice positioned at top right */}
          <div className="text-zinc-500 text-sm pt-2">
            © 2025 Shiven Saini
          </div>
        </header>
        
        {/* Adjusted grid to make chat section wider */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <WebcamSection />
          </div>
          
          <div className="col-span-7">
            <ChatSection />
          </div>
        </div>
      </div>
    </main>
  );
}
