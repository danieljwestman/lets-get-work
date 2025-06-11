
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Translation } from '@/types/admin';

// This is the admin-specific hook for managing translations
export const useTranslations = (themeId?: string) => {
  const { user } = useAuth();
  const [translations, setTranslations] = useState<Record<string, Translation[]>>({
    en: [],
    sv: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTranslations = useCallback(async () => {
    if (!themeId || !user) return;
    
    try {
      setLoading(true);
      console.log('🔧 ADMIN MANAGER: Loading all translations for management');
      
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('theme_id', themeId)
        .eq('user_id', user.id)
        .order('translation_key');

      if (error) throw error;

      // Map the data to our expected format
      const typedData = (data || []).map(item => ({
        id: item.id,
        theme_id: item.theme_id,
        language: item.language as 'en' | 'sv',
        translation_key: item.translation_key,
        published_value: item.published_value,
        draft_value: item.draft_value,
        user_id: item.user_id,
        updated_at: item.updated_at
      })) as Translation[];

      const groupedTranslations = {
        en: typedData.filter(t => t.language === 'en'),
        sv: typedData.filter(t => t.language === 'sv')
      };

      setTranslations(groupedTranslations);
      console.log(`✅ ADMIN MANAGER: Loaded translations for management`);
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setLoading(false);
    }
  }, [themeId, user]);

  useEffect(() => {
    if (themeId && user) {
      loadTranslations();
    }
  }, [themeId, user, loadTranslations]);

  const saveTranslation = async (language: 'en' | 'sv', key: string, value: string) => {
    if (!themeId || !user) return;

    try {
      setSaving(true);

      // Check if a translation already exists
      const { data: existingData } = await supabase
        .from('translations')
        .select('published_value')
        .eq('theme_id', themeId)
        .eq('language', language)
        .eq('translation_key', key)
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('translations')
        .upsert({
          theme_id: themeId,
          language,
          translation_key: key,
          draft_value: value,
          // If no existing translation, set published_value to the same value
          published_value: existingData?.published_value || value,
          user_id: user.id
        } as any, {
          onConflict: 'theme_id,language,translation_key'
        });

      if (error) throw error;
      
      // Reload translations to ensure consistency
      await loadTranslations();
    } catch (error) {
      console.error('Error saving translation:', error);
    } finally {
      setSaving(false);
    }
  };

  const publishSingleTranslation = async (language: 'en' | 'sv', key: string) => {
    if (!themeId || !user) return;

    try {
      setSaving(true);
      
      // First get the current draft value
      const { data: currentData, error: fetchError } = await supabase
        .from('translations')
        .select('draft_value')
        .eq('theme_id', themeId)
        .eq('language', language)
        .eq('translation_key', key)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Move draft_value to published_value and clear draft_value
      const { error } = await supabase
        .from('translations')
        .update({
          published_value: currentData.draft_value,
          draft_value: null
        } as any)
        .eq('theme_id', themeId)
        .eq('language', language)
        .eq('translation_key', key)
        .eq('user_id', user.id);

      if (error) throw error;
      
      console.log(`📤 ADMIN: Published single translation ${key} for ${language}`);
      
      // Reload translations to ensure consistency
      await loadTranslations();
    } catch (error) {
      console.error('Error publishing translation:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteTranslation = async (language: 'en' | 'sv', key: string) => {
    if (!themeId || !user) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('theme_id', themeId)
        .eq('language', language)
        .eq('translation_key', key)
        .eq('user_id', user.id);

      if (error) throw error;
      
      console.log(`🗑️ ADMIN: Deleted translation ${key} for ${language}`);
      
      // Reload translations to ensure consistency
      await loadTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
    } finally {
      setSaving(false);
    }
  };

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
