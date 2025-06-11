
import React from 'react';
import { Mail, CheckCircle, Bot, MessageSquare } from 'lucide-react';

interface SentMessage {
  id: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  subject: string | null;
  message: string;
  inquiry_type: string;
  source: string;
  conversation_context: string | null;
  email_sent_successfully: boolean;
  email_id: string | null;
  user_agent: string | null;
  ip_address: unknown;
  opportunity_id: string;
}

interface MessageStatsProps {
  messages: SentMessage[];
}

export const MessageStats: React.FC<MessageStatsProps> = ({ messages }) => {
  const totalMessages = messages.length;
  const successfulSends = messages.filter(m => m.email_sent_successfully).length;
  const danibotMessages = messages.filter(m => m.source === 'danibot_composer').length;
  const contactFormMessages = messages.filter(m => m.source === 'contact_modal').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-blue-700">Total Messages</div>
          <Mail className="h-5 w-5 text-blue-600" />
        </div>
        <div className="text-3xl font-bold text-blue-900">{totalMessages}</div>
        <div className="text-xs text-blue-600 mt-1">All time</div>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-green-700">Successful Sends</div>
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
        <div className="text-3xl font-bold text-green-900">{successfulSends}</div>
        <div className="text-xs text-green-600 mt-1">
          {totalMessages > 0 ? Math.round((successfulSends / totalMessages) * 100) : 0}% success rate
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-purple-700">DaniBot Messages</div>
          <Bot className="h-5 w-5 text-purple-600" />
        </div>
        <div className="text-3xl font-bold text-purple-900">{danibotMessages}</div>
        <div className="text-xs text-purple-600 mt-1">AI conversations</div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-orange-700">Contact Form</div>
          <MessageSquare className="h-5 w-5 text-orange-600" />
        </div>
        <div className="text-3xl font-bold text-orange-900">{contactFormMessages}</div>
        <div className="text-xs text-orange-600 mt-1">Direct submissions</div>
      </div>
    </div>
  );
};
