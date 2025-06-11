
import { useSimpleTranslations } from '@/hooks/useSimpleTranslations';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const useOpportunityTranslations = () => {
  const { opportunity } = useOpportunity();
  const { language } = useLanguage();
  const themeId = opportunity?.theme?.theme_id || 'default';
  
  const { translations, loading, error, t } = useSimpleTranslations(themeId, language as 'en' | 'sv');
  
  console.log(`🔧 OPPORTUNITY TRANSLATIONS: Using themeId: ${themeId}, language: ${language}, translations count: ${Object.keys(translations).length}`);
  
  return {
    translations,
    loading,
    error,
    t,
    themeId,
    language
  };
};
