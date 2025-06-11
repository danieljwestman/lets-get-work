
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface MessagesErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const MessagesErrorState: React.FC<MessagesErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-8">
        <div className="flex items-center justify-center space-x-3">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-900">Error Loading Messages</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
