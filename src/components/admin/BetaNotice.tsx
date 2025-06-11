
import React from 'react';

export const BetaNotice: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-blue-800">Beta Access</span>
      </div>
      <p className="text-sm text-blue-700">
        We're currently in beta! New account creation is temporarily disabled. 
        If you want to try it out, please reach out to our team.
      </p>
    </div>
  );
};
