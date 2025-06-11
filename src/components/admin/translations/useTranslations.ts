
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Translation } from '@/types/admin';

export const useTranslations = (themeId: string) => {
  const [translations, setTranslations] = useState<{
    en: Translation[];
    sv: Translation[];
  }>({
    en: [],
    sv: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTranslations = async () => {
    if (!themeId) {
      console.log('🔧 ADMIN TRANSLATIONS: No themeId provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔧 ADMIN TRANSLATIONS: Loading translations for theme:', themeId);

      // Fetch all translations for this theme
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('theme_id', themeId)
        .order('translation_key');

      if (error) {
        console.error('🔧 ADMIN TRANSLATIONS: Error loading translations:', error);
        throw error;
      }

      console.log('🔧 ADMIN TRANSLATIONS: Raw translations data:', data);

      // Group by language with proper type casting
      const enTranslations = (data?.filter(t => t.language === 'en') || []) as Translation[];
      const svTranslations = (data?.filter(t => t.language === 'sv') || []) as Translation[];

      setTranslations({
        en: enTranslations,
        sv: svTranslations
      });

      console.log('🔧 ADMIN TRANSLATIONS: Loaded translations:', {
        en: enTranslations.length,
        sv: svTranslations.length
      });
    } catch (error) {
      console.error('🔧 ADMIN TRANSLATIONS: Error in loadTranslations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTranslation = async (language: 'en' | 'sv', key: string, value: string) => {
    setSaving(true);
    try {
      console.log('🔧 ADMIN TRANSLATIONS: Saving translation:', { language, key, value });

      // Check if translation already exists
      const existingTranslation = translations[language].find(t => t.translation_key === key);

      if (existingTranslation) {
        // Update existing
        const { error } = await supabase
          .from('translations')
          .update({ 
            draft_value: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingTranslation.id);

        if (error) throw error;
      } else {
        // Create new - ensure all required fields are provided
        const { error } = await supabase
          .from('translations')
          .insert({
            theme_id: themeId,
            language: language,
            translation_key: key,
            draft_value: value,
            published_value: '', // Required field with default empty value
            user_id: (await supabase.auth.getUser()).data.user?.id || ''
          });

        if (error) throw error;
      }

      await loadTranslations();
    } catch (error) {
      console.error('🔧 ADMIN TRANSLATIONS: Error saving translation:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const publishSingleTranslation = async (language: 'en' | 'sv', key: string) => {
    try {
      console.log('🔧 ADMIN TRANSLATIONS: Publishing single translation:', { language, key });
      
      const translation = translations[language].find(t => t.translation_key === key);
      if (!translation) {
        throw new Error('Translation not found');
      }

      const { error } = await supabase
        .from('translations')
        .update({ 
          published_value: translation.draft_value || translation.published_value,
          updated_at: new Date().toISOString()
        })
        .eq('id', translation.id);

      if (error) throw error;

      await loadTranslations();
    } catch (error) {
      console.error('🔧 ADMIN TRANSLATIONS: Error publishing translation:', error);
      throw error;
    }
  };

  const deleteTranslation = async (language: 'en' | 'sv', key: string) => {
    try {
      console.log('🔧 ADMIN TRANSLATIONS: Deleting translation:', { language, key });
      
      const translation = translations[language].find(t => t.translation_key === key);
      if (!translation) {
        throw new Error('Translation not found');
      }

      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', translation.id);

      if (error) throw error;

      await loadTranslations();
    } catch (error) {
      console.error('🔧 ADMIN TRANSLATIONS: Error deleting translation:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadTranslations();
  }, [themeId]);

  return {
    translations,
    loading,
    saving,
    saveTranslation,
    publishSingleTranslation,
    deleteTranslation,
    loadTranslations
  };
};
