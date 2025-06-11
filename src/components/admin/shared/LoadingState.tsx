
import React, { useState, useEffect } from 'react';

interface LoadingStateProps {
  message?: string;
  minDelay?: number; // Minimum delay in milliseconds
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading...",
  minDelay = 600
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, minDelay);

    return () => clearTimeout(timer);
  }, [minDelay]);

  if (!showContent) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center opacity-0">
          {/* Hidden content to prevent layout shift */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center animate-fade-in">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
