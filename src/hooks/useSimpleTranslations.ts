
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSimpleTranslations = (themeId: string, language: 'en' | 'sv') => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!themeId || !language) {
      console.log('🔧 SIMPLE TRANSLATIONS: Missing themeId or language, skipping fetch');
      setLoading(false);
      setError('Missing themeId or language parameters');
      return;
    }

    const loadTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔧 SIMPLE TRANSLATIONS: Fetching translations for ${themeId}/${language}`);
        
        const { data, error: rpcError } = await supabase
          .rpc('get_public_translations', { 
            theme_id_param: themeId, 
            language_param: language 
          });

        if (rpcError) {
          console.error('🔧 SIMPLE TRANSLATIONS: RPC Error:', rpcError);
          throw new Error(`RPC Error: ${rpcError.message || rpcError}`);
        }

        console.log('🔧 SIMPLE TRANSLATIONS: Raw data received:', data);

        if (!Array.isArray(data)) {
          console.warn('🔧 SIMPLE TRANSLATIONS: Expected array, got:', typeof data);
          setTranslations({});
          return;
        }

        // Convert array to object
        const translationsMap: Record<string, string> = {};
        data.forEach((item: any) => {
          if (item?.translation_key && item?.published_value) {
            translationsMap[item.translation_key] = item.published_value;
          }
        });

        console.log('🔧 SIMPLE TRANSLATIONS: Final translations:', translationsMap);
        console.log('🔧 SIMPLE TRANSLATIONS: Translations count:', Object.keys(translationsMap).length);
        
        setTranslations(translationsMap);
      } catch (error: any) {
        console.error('🔧 SIMPLE TRANSLATIONS: Error loading translations:', error);
        setError(error?.message || 'Failed to load translations');
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [themeId, language]);

  // Simple translation function
  const t = (key: string, fallback?: string): string => {
    const value = translations[key];
    if (value && value.trim() !== '') {
      return value;
    }
    
    // Return fallback or key in development mode
    if (fallback) {
      return fallback;
    }
    
    if (process.env.NODE_ENV === 'development') {
      return `[${key}]`;
    }
    
    // Convert key to readable text for production
    const keyParts = key.split('.');
    const lastPart = keyParts[keyParts.length - 1];
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim() || 'Content';
  };

  return {
    translations,
    loading,
    error,
    t
  };
};
