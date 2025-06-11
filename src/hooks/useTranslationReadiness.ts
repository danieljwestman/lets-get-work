
import { useState, useEffect, useRef } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';

interface TranslationReadinessState {
  isReady: boolean;
  isLoading: boolean;
  currentThemeId: string | null;
  hasMinimumTranslations: boolean;
}

export const useTranslationReadiness = (
  translations: Record<string, any>,
  translationLoading: boolean,
  language: 'en' | 'sv'
) => {
  const { opportunity } = useOpportunity();
  const [readinessState, setReadinessState] = useState<TranslationReadinessState>({
    isReady: false,
    isLoading: true,
    currentThemeId: null,
    hasMinimumTranslations: false
  });

  const previousThemeIdRef = useRef<string | null>(null);

  const currentThemeId = opportunity?.theme?.theme_id || 'default';

  // Check if we have meaningful translations (not just empty object)
  const checkMinimumTranslations = (translationData: Record<string, any>): boolean => {
    const translationCount = Object.keys(translationData).length;
    console.log(`🔍 TRANSLATION READINESS: Checking ${translationCount} translations for ${currentThemeId}/${language}`);
    
    // Need at least some translations to be considered ready
    // This prevents showing content with fallback keys
    return translationCount >= 5; // Require minimum 5 translations for basic content
  };

  useEffect(() => {
    const hasThemeChanged = previousThemeIdRef.current !== currentThemeId;
    const hasTranslations = Object.keys(translations).length > 0;
    const hasMinimumTranslations = hasTranslations && checkMinimumTranslations(translations);

    console.log(`🔍 TRANSLATION READINESS: Effect triggered:`, {
      currentThemeId,
      previousThemeId: previousThemeIdRef.current,
      hasThemeChanged,
      hasTranslations,
      hasMinimumTranslations,
      translationLoading,
      translationCount: Object.keys(translations).length
    });

    // If theme changed, mark as loading immediately
    if (hasThemeChanged && previousThemeIdRef.current !== null) {
      console.log(`🔄 TRANSLATION READINESS: Theme changed from ${previousThemeIdRef.current} to ${currentThemeId} - marking as loading`);
      setReadinessState(prev => ({
        ...prev,
        isReady: false,
        isLoading: true,
        currentThemeId
      }));
    }

    previousThemeIdRef.current = currentThemeId;

    // Only mark as ready when:
    // 1. Not loading
    // 2. Have theme ID
    // 3. Have minimum translations loaded
    const isFullyReady = !translationLoading && 
                        Boolean(currentThemeId) && 
                        hasMinimumTranslations;
    
    console.log(`🔍 TRANSLATION READINESS: Readiness check for ${currentThemeId}/${language}:`, {
      translationLoading,
      hasTranslations,
      hasMinimumTranslations,
      isFullyReady,
      translationCount: Object.keys(translations).length,
      currentThemeId
    });

    setReadinessState({
      isReady: isFullyReady,
      isLoading: translationLoading || !currentThemeId || !hasMinimumTranslations,
      currentThemeId,
      hasMinimumTranslations
    });
  }, [translations, translationLoading, currentThemeId, language]);

  console.log(`🔍 TRANSLATION READINESS: Current state:`, {
    isReady: readinessState.isReady,
    isLoading: readinessState.isLoading,
    currentThemeId: readinessState.currentThemeId,
    hasMinimumTranslations: readinessState.hasMinimumTranslations,
    translationCount: Object.keys(translations).length
  });

  return readinessState;
};
