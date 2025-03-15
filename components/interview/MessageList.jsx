// components/interview/MessageList.jsx
import ChatTypingAnimation from './ChatTypingAnimation';

export default function MessageList({ messages, messagesEndRef }) {
  return (
    <div className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-zinc-900">
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
                ? 'bg-orange-500 text-white rounded-br-none'
                : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700'
            }`}
          >
            {message.text}
            {message.isTyping && <ChatTypingAnimation />}
          </div>
          <div className="text-xs text-zinc-500 mt-1 mx-1">
            {message.sender === 'user' ? 'You' : 'AI Interviewer'} • just now
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
