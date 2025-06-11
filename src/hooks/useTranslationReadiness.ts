
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
  const stabilityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentThemeId = opportunity?.theme?.theme_id || 'default';

  // Check if we have meaningful translations
  const checkMinimumTranslations = (translationData: Record<string, any>): boolean => {
    const translationCount = Object.keys(translationData).length;
    console.log(`🔍 TRANSLATION READINESS: Checking ${translationCount} translations for ${currentThemeId}/${language}`);
    
    // Lowered threshold and added fallback for smaller themes
    return translationCount >= 3 || (translationCount > 0 && !translationLoading);
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

    // Clear any existing stability timer
    if (stabilityTimerRef.current) {
      clearTimeout(stabilityTimerRef.current);
      stabilityTimerRef.current = null;
    }

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

    // Only mark as ready when loading is complete AND we have translations
    const isDataReady = !translationLoading && 
                       Boolean(currentThemeId) && 
                       hasMinimumTranslations;
    
    if (isDataReady) {
      // Add small stability delay to prevent flicker
      stabilityTimerRef.current = setTimeout(() => {
        console.log(`🔍 TRANSLATION READINESS: Marking ready after stability check for ${currentThemeId}/${language}`);
        setReadinessState({
          isReady: true,
          isLoading: false,
          currentThemeId,
          hasMinimumTranslations
        });
      }, 50); // Very short delay to ensure stability
    } else {
      setReadinessState(prev => ({
        ...prev,
        isReady: false,
        isLoading: translationLoading || !currentThemeId || !hasMinimumTranslations,
        currentThemeId,
        hasMinimumTranslations
      }));
    }

    // Cleanup function
    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
    };
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
