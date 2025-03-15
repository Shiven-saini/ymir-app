// hooks/useMessages.js
import { useState, useRef, useEffect } from 'react';

export default function useMessages() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      ...message
    }]);
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  return {
    messages,
    messagesEndRef,
    addMessage,
    clearMessages
  };
}
