import React, { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import { EmailComposer } from './EmailComposer';
import type { Message } from '@/types/chat';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onEmailSent: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading, onEmailSent }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Generate conversation context from messages for email composer
  const generateConversationContext = () => {
    const contextMessages = messages
      .filter(msg => !msg.action) // Exclude action messages like email_composed
      .map(msg => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp
      }));
    
    return JSON.stringify(contextMessages);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          {message.sender === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
          )}
          <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-first' : ''}`}>
            <div className={`rounded-2xl px-4 py-3 ${
              message.sender === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-4' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
            
            {/* Render EmailComposer for email_composed action - disable toast to prevent duplicates */}
            {message.action === 'email_composed' && (
              <div className="mt-4">
                <EmailComposer 
                  conversationContext={generateConversationContext()}
                  onEmailSent={onEmailSent}
                  showSuccessToast={false}
                />
              </div>
            )}
          </div>
          {message.sender === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="bg-gray-100 rounded-2xl px-4 py-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
