
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Translations, PublicTranslations } from '@/types/translations';

export const useTranslations = (themeId: string, language: 'en' | 'sv') => {
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Prevent multiple simultaneous calls
  const isLoadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadTranslations = useCallback(async (retryAttempt = 0) => {
    console.log(`🔧 TRANSLATIONS HOOK: Starting loadTranslations with themeId: "${themeId}", language: "${language}", retry: ${retryAttempt}`);
    
    if (!themeId || !language) {
      console.log('🔧 TRANSLATIONS HOOK: Missing themeId or language, skipping fetch:', { themeId, language });
      setLoading(false);
      setError('Missing themeId or language parameters');
      return;
    }

    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log('🔧 TRANSLATIONS HOOK: Already loading, skipping duplicate call');
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      setError(null);
      setLoading(true);
      isLoadingRef.current = true;
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      console.log(`🔧 TRANSLATIONS HOOK: Calling get_public_translations RPC for ${themeId}/${language}`);
      
      const { data, error: rpcError } = await supabase
        .rpc('get_public_translations', { 
          theme_id_param: themeId, 
          language_param: language 
        });

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🔧 TRANSLATIONS HOOK: Request was aborted');
        return;
      }

      console.log(`🔧 TRANSLATIONS HOOK: RPC Response - Error:`, rpcError);
      console.log(`🔧 TRANSLATIONS HOOK: RPC Response - Data:`, data);
      console.log(`🔧 TRANSLATIONS HOOK: Data type: ${typeof data}, Array: ${Array.isArray(data)}, Length: ${data?.length || 0}`);

      if (rpcError) {
        console.error('🔧 TRANSLATIONS HOOK: RPC Error:', rpcError);
        throw new Error(`RPC Error: ${rpcError.message || rpcError}`);
      }

      // Handle the response data
      if (!data) {
        console.warn('🔧 TRANSLATIONS HOOK: No data returned from RPC call');
        setTranslations({});
        setError(null); // This is not an error, just no translations
        return;
      }

      if (!Array.isArray(data)) {
        console.error('🔧 TRANSLATIONS HOOK: Expected array but got:', typeof data, data);
        throw new Error(`Invalid data format: expected array, got ${typeof data}`);
      }

      // Transform the array data to our expected format
      const translationsMap: Translations = {};
      let validCount = 0;
      let invalidCount = 0;

      data.forEach((item: any, index: number) => {
        console.log(`🔧 TRANSLATIONS HOOK: Processing item ${index}:`, item);
        
        if (!item || typeof item !== 'object') {
          console.warn(`🔧 TRANSLATIONS HOOK: Invalid item at index ${index}:`, item);
          invalidCount++;
          return;
        }

        const key = item.translation_key;
        const value = item.published_value;

        if (!key || typeof key !== 'string') {
          console.warn(`🔧 TRANSLATIONS HOOK: Missing or invalid translation_key at index ${index}:`, item);
          invalidCount++;
          return;
        }

        if (value === null || value === undefined || typeof value !== 'string') {
          console.warn(`🔧 TRANSLATIONS HOOK: Missing or invalid published_value for key "${key}":`, item);
          invalidCount++;
          return;
        }

        translationsMap[key] = value;
        validCount++;
        console.log(`🔧 TRANSLATIONS HOOK: Added translation: ${key} = "${value}"`);
      });

      console.log(`🔧 TRANSLATIONS HOOK: Processed ${validCount} valid translations, ${invalidCount} invalid entries`);
      console.log(`🔧 TRANSLATIONS HOOK: Final translations object:`, translationsMap);
      console.log(`🔧 TRANSLATIONS HOOK: Sample keys:`, Object.keys(translationsMap).slice(0, 10));

      setTranslations(translationsMap);
      setRetryCount(0); // Reset retry count on success
      console.log(`✅ TRANSLATIONS HOOK: Successfully loaded ${validCount} translations`);

    } catch (error: any) {
      console.error('🔧 TRANSLATIONS HOOK: Failed to load translations:', error);
      
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      setError(errorMessage);
      
      // Retry logic for network errors (max 3 retries)
      if (retryAttempt < 3 && !abortControllerRef.current?.signal.aborted) {
        const delay = Math.pow(2, retryAttempt) * 1000; // Exponential backoff
        console.log(`🔧 TRANSLATIONS HOOK: Retrying in ${delay}ms (attempt ${retryAttempt + 1}/3)`);
        
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          loadTranslations(retryAttempt + 1);
        }, delay);
        return;
      }
      
      // On final failure, set empty translations so the app doesn't break
      setTranslations({});
      console.error(`🔧 TRANSLATIONS HOOK: Final failure after ${retryAttempt + 1} attempts`);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [themeId, language]);

  useEffect(() => {
    console.log(`🔧 TRANSLATIONS HOOK: useEffect triggered with themeId: "${themeId}", language: "${language}"`);
    
    // Reset state when dependencies change
    setError(null);
    setRetryCount(0);
    
    // Load translations immediately
    loadTranslations();

    return () => {
      // Cancel ongoing request when component unmounts or dependencies change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isLoadingRef.current = false;
    };
  }, [loadTranslations]);

  // Helper function to get translation with fallback
  const t = useCallback((key: string, fallback?: string): string => {
    const value = translations[key];
    console.log(`🔧 TRANSLATIONS HOOK: Translation lookup for key "${key}": ${value ? `"${value}"` : 'NOT FOUND'}`);
    
    if (value && value.trim() !== '') {
      return value;
    }
    
    const result = fallback || key;
    console.log(`🔧 TRANSLATIONS HOOK: Using fallback for "${key}": "${result}"`);
    return result;
  }, [translations]);

  return {
    translations,
    loading,
    error,
    retryCount,
    t,
    refreshTranslations: () => loadTranslations()
  };
};
