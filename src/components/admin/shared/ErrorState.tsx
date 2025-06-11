
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  retryLabel = "Try Again" 
}) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-6 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            {retryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
