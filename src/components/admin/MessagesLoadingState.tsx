
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

export const MessagesLoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Loading Messages</h3>
              <p className="text-gray-600">Fetching your contact messages and inquiries...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
