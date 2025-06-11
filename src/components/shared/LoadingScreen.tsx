
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  minDelay?: number; // Minimum delay in milliseconds
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ minDelay = 0 }) => {
  const [showContent, setShowContent] = useState(minDelay === 0);

  useEffect(() => {
    if (minDelay > 0) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, minDelay);

      return () => clearTimeout(timer);
    }
  }, [minDelay]);

  if (!showContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center opacity-0">
          {/* Hidden content to prevent layout shift */}
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600 text-lg">Loading your experience...</p>
      </div>
    </div>
  );
};
