
import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';

export const MessagesEmptyState: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start space-x-3">
        <Mail className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-blue-800">No Messages Yet</h4>
          <p className="text-blue-700 mt-1">
            You haven't received any messages from visitors yet. Here's how people can contact you:
          </p>
          <ul className="list-disc list-inside text-blue-700 mt-3 space-y-1">
            <li>Contact forms on your portfolio website</li>
            <li>DaniBot AI assistant conversations</li>
            <li>Direct inquiries from potential clients or employers</li>
          </ul>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
              <MessageSquare className="h-4 w-4" />
              Getting Started
            </div>
            <p className="text-blue-700 text-sm">
              Share your portfolio link to start receiving messages from interested visitors and potential opportunities!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
