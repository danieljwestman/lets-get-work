
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export const LoadingWrapper = ({
  children,
  isLoading = false,
  error = null,
  fallback,
  errorFallback
}: LoadingWrapperProps) => {
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        {errorFallback || (
          <div className="text-center">
            <p className="text-red-600 mb-2">Something went wrong</p>
            <p className="text-sm text-gray-500">{error.message}</p>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        {fallback || (
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
