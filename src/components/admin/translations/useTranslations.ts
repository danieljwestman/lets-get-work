
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

      // Group by language
      const enTranslations = data?.filter(t => t.language === 'en') || [];
      const svTranslations = data?.filter(t => t.language === 'sv') || [];

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

  const saveTranslation = async (translation: Partial<Translation>) => {
    setSaving(true);
    try {
      console.log('🔧 ADMIN TRANSLATIONS: Saving translation:', translation);

      if (translation.id) {
        // Update existing
        const { error } = await supabase
          .from('translations')
          .update(translation)
          .eq('id', translation.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('translations')
          .insert({
            ...translation,
            theme_id: themeId
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

  const publishSingleTranslation = async (translation: Translation) => {
    try {
      console.log('🔧 ADMIN TRANSLATIONS: Publishing single translation:', translation.id);
      
      const { error } = await supabase
        .from('translations')
        .update({ 
          published_value: translation.draft_value,
          published_at: new Date().toISOString()
        })
        .eq('id', translation.id);

      if (error) throw error;

      await loadTranslations();
    } catch (error) {
      console.error('🔧 ADMIN TRANSLATIONS: Error publishing translation:', error);
      throw error;
    }
  };

  const deleteTranslation = async (translationId: string) => {
    try {
      console.log('🔧 ADMIN TRANSLATIONS: Deleting translation:', translationId);
      
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', translationId);

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
