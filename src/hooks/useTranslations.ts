
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Translations, PublicTranslations } from '@/types/translations';

export const useTranslations = (themeId: string, language: 'en' | 'sv') => {
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  const loadTranslations = useCallback(async () => {
    console.log(`🔧 PUBLIC HOOK: Starting loadTranslations with themeId: "${themeId}", language: "${language}"`);
    
    if (!themeId || !language) {
      console.log('🔧 PUBLIC HOOK: Missing themeId or language, skipping fetch:', { themeId, language });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`🔧 PUBLIC HOOK: Calling get_public_translations for ${themeId}/${language}`);
      
      // Use the updated security definer function for public access
      const { data, error } = await supabase
        .rpc('get_public_translations', { 
          theme_id_param: themeId, 
          language_param: language 
        });

      if (error) {
        console.error('🔧 PUBLIC HOOK: Error loading translations:', error);
        throw error;
      }

      console.log(`🔧 PUBLIC HOOK: Raw translations data for ${themeId}/${language}:`, data);

      // Transform the data to our expected format
      const translationsMap: Translations = {};
      if (data && Array.isArray(data)) {
        data.forEach((item: { translation_key: string; published_value: string }) => {
          translationsMap[item.translation_key] = item.published_value;
        });
      }

      console.log(`🔧 PUBLIC HOOK: Transformed ${Object.keys(translationsMap).length} translations for ${themeId}/${language}:`, 
        Object.keys(translationsMap).slice(0, 10)); // Show first 10 keys

      setTranslations(translationsMap);
      console.log(`✅ PUBLIC HOOK: Successfully loaded ${Object.keys(translationsMap).length} translations`);
    } catch (error) {
      console.error('🔧 PUBLIC HOOK: Failed to load translations:', error);
      // On error, set empty translations so the app doesn't break
      setTranslations({});
    } finally {
      setLoading(false);
    }
  }, [themeId, language]);

  useEffect(() => {
    console.log(`🔧 PUBLIC HOOK: useEffect triggered with themeId: "${themeId}", language: "${language}"`);
    loadTranslations();
  }, [loadTranslations]);

  // Helper function to get translation with fallback
  const t = useCallback((key: string, fallback?: string): string => {
    const value = translations[key];
    console.log(`🔧 PUBLIC HOOK: Translation lookup for key "${key}": ${value ? `"${value}"` : 'NOT FOUND'}`);
    if (value && value.trim() !== '') {
      return value;
    }
    const result = fallback || key;
    console.log(`🔧 PUBLIC HOOK: Using fallback for "${key}": "${result}"`);
    return result;
  }, [translations]);

  return {
    translations,
    loading,
    t,
    refreshTranslations: loadTranslations
  };
};
