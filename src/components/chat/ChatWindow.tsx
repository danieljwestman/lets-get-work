
import React from 'react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { X, Bot } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Message } from '@/types/chat';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onEmailSent: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClose,
  onEmailSent
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col animate-in fade-in-0 zoom-in-95 duration-300 overflow-hidden ${
        isMobile 
          ? 'w-full h-full max-w-none max-h-none' 
          : 'w-full max-w-2xl h-[80vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">DaniBot</h3>
              <p className="text-sm text-blue-100">Daniel's personal career assistant</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white hover:bg-opacity-20 h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          onEmailSent={onEmailSent}
        />

        {/* Input */}
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
