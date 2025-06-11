
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useCompany } from '@/contexts/OpportunityContext';
import { FloatingChatButton } from './FloatingChatButton';
import { ChatWindow } from './ChatWindow';
import { useChatState } from './hooks/useChatState';
import { useMessageHandler } from './hooks/useMessageHandler';
import type { CareerChatAssistantProps } from '@/types/chat';

export interface CareerChatAssistantRef {
  openChat: () => void;
}

export const CareerChatAssistant = forwardRef<CareerChatAssistantRef, CareerChatAssistantProps>((props, ref) => {
  const { company } = useCompany();
  const chatState = useChatState();
  const messageHandler = useMessageHandler({
    addMessage: chatState.addMessage,
    clearInput: chatState.clearInput,
    setIsLoading: chatState.setIsLoading
  });

  // Initialize messages when company changes
  useEffect(() => {
    if (company?.daniBot?.customGreeting) {
      chatState.setMessages([
        {
          id: '1',
          content: company.daniBot.customGreeting || "Hi there! 👋 I'm DaniBot, Daniel's personal AI assistant. I'm here to share everything about Daniel's customer success expertise, technical skills, and professional background. I can also help you compose and send emails directly to Daniel. What would you like to know?",
          sender: 'assistant',
          timestamp: new Date()
        }
      ]);
    }
  }, [company?.daniBot?.customGreeting]);

  useImperativeHandle(ref, () => ({
    openChat: chatState.openChat
  }));

  const handleSendMessage = (message: string) => {
    messageHandler.handleSendMessage(message);
  };

  if (!chatState.isOpen) {
    return <FloatingChatButton onClick={chatState.openChat} />;
  }

  return (
    <ChatWindow
      messages={chatState.messages}
      isLoading={chatState.isLoading}
      onSendMessage={handleSendMessage}
      onEmailSent={messageHandler.handleEmailSent}
      onClose={chatState.closeChat}
    />
  );
});

CareerChatAssistant.displayName = "CareerChatAssistant";
