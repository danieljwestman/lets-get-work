
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTooltipDateInTimezone } from '@/components/analytics/utils/timezoneUtils';
import { TimezoneIndicator } from '@/components/analytics/components/TimezoneIndicator';
import type { Message } from '@/types/admin';

interface MessageDetailModalProps {
  message: Message | null;
  onClose: () => void;
  getSourceBadge: (source: string) => React.ReactNode;
  timezone: string;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  message,
  onClose,
  getSourceBadge,
  timezone
}) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Message Details</h3>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Sender</label>
                <div className="mt-1">
                  <div className="font-medium">{message.sender_name}</div>
                  <div className="text-sm text-gray-500">{message.sender_email}</div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <div className="mt-1 flex items-center gap-2">
                  <span>{formatTooltipDateInTimezone(message.created_at, 'all', timezone)}</span>
                  <TimezoneIndicator timezone={timezone} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Source</label>
                <div className="mt-1">{getSourceBadge(message.source)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Inquiry Type</label>
                <div className="mt-1">
                  <Badge variant="outline">{message.inquiry_type}</Badge>
                </div>
              </div>
            </div>

            {message.subject && (
              <div>
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <div className="mt-1">{message.subject}</div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">Message</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                {message.message}
              </div>
            </div>

            {message.conversation_context && (
              <div>
                <label className="text-sm font-medium text-gray-600">Conversation Context</label>
                <div className="mt-1 p-3 bg-blue-50 rounded-lg text-sm">
                  {message.conversation_context}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <label className="font-medium">Opportunity ID</label>
                <div>{message.opportunity_id}</div>
              </div>
              <div>
                <label className="font-medium">Email Status</label>
                <div>{message.email_sent_successfully ? 'Successfully sent' : 'Failed to send'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
