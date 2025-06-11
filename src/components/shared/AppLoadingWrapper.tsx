
import React, { useState, useEffect } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationReadiness } from '@/hooks/useTranslationReadiness';
import { useSimpleTranslations } from '@/hooks/useSimpleTranslations';
import { LoadingScreen } from './LoadingScreen';

interface AppLoadingWrapperProps {
  children: React.ReactNode;
  isDashboard?: boolean;
}

export const AppLoadingWrapper: React.FC<AppLoadingWrapperProps> = ({ 
  children, 
  isDashboard = false 
}) => {
  const { opportunity, isLoading: opportunityLoading, error: opportunityError } = useOpportunity();
  const { language, isLoading: languageLoading } = useLanguage();

  // Only check translation readiness for opportunity pages
  const themeId = opportunity?.theme?.theme_id || 'default';
  const { translations, loading: translationLoading } = useSimpleTranslations(
    isDashboard ? '' : themeId, 
    isDashboard ? 'en' : (language as 'en' | 'sv')
  );
  
  const translationReadiness = useTranslationReadiness(
    translations, 
    translationLoading, 
    (language as 'en' | 'sv')
  );

  // For dashboard pages, just check basic loading without translations
  if (isDashboard) {
    if (opportunityLoading || languageLoading) {
      return <LoadingScreen />;
    }
    
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
  }

  // For opportunity pages, wait for everything including translations
  // Be more strict - only show content when translations are truly ready
  const shouldShowLoading = opportunityLoading || 
                           languageLoading || 
                           !opportunity || 
                           !translationReadiness.isReady ||
                           translationReadiness.isLoading;

  console.log('🔧 APP LOADING WRAPPER: Loading state check:', {
    opportunityLoading,
    languageLoading,
    hasOpportunity: !!opportunity,
    translationReady: translationReadiness.isReady,
    translationLoading: translationReadiness.isLoading,
    translationCount: Object.keys(translations).length,
    shouldShowLoading,
    isDashboard
  });

  if (shouldShowLoading) {
    return <LoadingScreen />;
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
