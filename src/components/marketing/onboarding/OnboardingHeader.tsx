
import React from 'react';
import { PlayCircle } from 'lucide-react';

export const OnboardingHeader: React.FC = () => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-teal-50 rounded-full text-green-700 text-sm font-medium mb-6">
        <PlayCircle className="h-4 w-4" />
        Interactive Demo
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
        Get Started in
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 3 Simple Steps</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        From search to success — we guide you step by step to create a beautiful personal presentation that's easy to share and hard to forget.
      </p>
    </div>
  );
};
