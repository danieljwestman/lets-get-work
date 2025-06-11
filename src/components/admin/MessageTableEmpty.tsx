
import React from 'react';
import { Mail } from 'lucide-react';

export const MessageTableEmpty: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
      <p className="text-gray-500">
        Messages will appear here once users submit contact forms or interact with DaniBot.
      </p>
    </div>
  );
};
