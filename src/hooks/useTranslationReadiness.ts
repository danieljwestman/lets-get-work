
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
  const stabilityTimerRef = useRef<NodeJS.Timeout>();

  const currentThemeId = opportunity?.theme?.theme_id || 'default';

  // Check if we have translations (even if minimal)
  const checkMinimumTranslations = (translationData: Record<string, any>): boolean => {
    const translationCount = Object.keys(translationData).length;
    console.log(`🔍 TRANSLATION READINESS: Checking ${translationCount} translations for ${currentThemeId}/${language}`);
    
    // For now, consider any translations as sufficient since we have fallbacks
    return translationCount > 0;
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

    // Clear any existing stability timer
    if (stabilityTimerRef.current) {
      clearTimeout(stabilityTimerRef.current);
    }

    // Wait for translations to be stable before marking as ready
    stabilityTimerRef.current = setTimeout(() => {
      // If translations are not loading and we have theme ID, we're ready
      // Even if we don't have translations, we should still render (with fallbacks)
      const isFullyReady = !translationLoading && Boolean(currentThemeId);
      
      console.log(`🔍 TRANSLATION READINESS: Stability check for ${currentThemeId}/${language}:`, {
        translationLoading,
        hasTranslations,
        hasMinimumTranslations,
        isFullyReady,
        translationCount: Object.keys(translations).length,
        currentThemeId
      });

      setReadinessState({
        isReady: isFullyReady,
        isLoading: translationLoading || !currentThemeId,
        currentThemeId,
        hasMinimumTranslations
      });
    }, 100); // Small delay to ensure stability

    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
    };
  }, [translations, translationLoading, currentThemeId, language]);

  console.log(`🔍 TRANSLATION READINESS: Current state:`, {
    isReady: readinessState.isReady,
    isLoading: readinessState.isLoading,
    currentThemeId: readinessState.currentThemeId,
    hasMinimumTranslations: readinessState.hasMinimumTranslations
  });

  return readinessState;
};
