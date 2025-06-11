
import React, { useState, useEffect } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingScreen } from './LoadingScreen';

interface AppLoadingWrapperProps {
  children: React.ReactNode;
}

export const AppLoadingWrapper: React.FC<AppLoadingWrapperProps> = ({ children }) => {
  const { opportunity, isLoading: opportunityLoading, error: opportunityError } = useOpportunity();
  const { isLoading: languageLoading } = useLanguage();
  const [hasMinimumDelay, setHasMinimumDelay] = useState(false);

  // Ensure minimum loading time for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMinimumDelay(true);
    }, 1000); // 1 second minimum delay

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while either context is loading OR while translations are not ready OR minimum delay hasn't passed
  const shouldShowLoading = opportunityLoading || languageLoading || !opportunity || !hasMinimumDelay;

  if (shouldShowLoading) {
    return <LoadingScreen minDelay={0} />; // No additional delay since we handle it here
  }

  // Show error screen if opportunity failed to load
  if (opportunityError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Failed to load configuration</p>
          <p className="text-gray-600">{opportunityError}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
