
import { useState } from 'react';
import type { Message } from '@/types/chat';

export const useChatState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openChat = () => {
    console.log('Opening chat');
    setIsOpen(true);
  };

  const closeChat = () => {
    console.log('Closing chat');
    setIsOpen(false);
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearInput = () => {
    setInputValue('');
  };

  const getConversationContext = () => {
    return messages
      .filter(msg => msg.sender === 'user' || (msg.sender === 'assistant' && !msg.action))
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join('\n');
  };

  return {
    isOpen,
    messages,
    inputValue,
    isLoading,
    setMessages,
    setInputValue,
    setIsLoading,
    openChat,
    closeChat,
    addMessage,
    clearInput,
    getConversationContext
  };
};
