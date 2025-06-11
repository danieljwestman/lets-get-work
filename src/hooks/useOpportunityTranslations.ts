
import { useTranslations } from '@/hooks/useTranslations';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { createSafeTranslationFunction } from '@/utils/translations';

export const useOpportunityTranslations = () => {
  const { opportunity } = useOpportunity();
  const { language } = useLanguage();
  const themeId = opportunity?.theme?.theme_id || 'default';
  
  const { translations, loading, error, retryCount, t: rawT, refreshTranslations } = useTranslations(themeId, language as 'en' | 'sv');
  
  // Always create a safe translation function, even when loading or when translations are empty
  const t = createSafeTranslationFunction(translations || {});
  
  console.log(`🔧 OPPORTUNITY TRANSLATIONS: Using themeId: ${themeId}, language: ${language}, translations count: ${Object.keys(translations || {}).length}, error: ${error}, retryCount: ${retryCount}`);
  
  return {
    translations: translations || {},
    loading,
    error,
    retryCount,
    t,
    themeId,
    language,
    refreshTranslations
  };
};
