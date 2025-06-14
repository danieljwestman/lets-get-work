
import React from 'react';
import { CheckCircle } from 'lucide-react';

export const OnboardingSuccessMessage: React.FC = () => {
  return (
    <div className="text-center pt-6">
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-teal-50 text-green-700 rounded-full text-sm font-medium">
        <CheckCircle className="h-5 w-5" />
        Join thousands who've transformed their job search
      </div>
    </div>
  );
};
