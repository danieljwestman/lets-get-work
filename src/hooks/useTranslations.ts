
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
    console.log(`🔧 PUBLIC HOOK: Starting loadTranslations with themeId: "${themeId}", language: "${language}", retry: ${retryAttempt}`);
    
    if (!themeId || !language) {
      console.log('🔧 PUBLIC HOOK: Missing themeId or language, skipping fetch:', { themeId, language });
      setLoading(false);
      setError('Missing themeId or language parameters');
      return;
    }

    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log('🔧 PUBLIC HOOK: Already loading, skipping duplicate call');
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
      
      console.log(`🔧 PUBLIC HOOK: Calling get_public_translations for ${themeId}/${language}`);
      
      // Add timeout wrapper for the RPC call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
      });

      const rpcPromise = supabase
        .rpc('get_public_translations', { 
          theme_id_param: themeId, 
          language_param: language 
        });

      const { data, error: rpcError } = await Promise.race([rpcPromise, timeoutPromise]) as any;

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🔧 PUBLIC HOOK: Request was aborted');
        return;
      }

      if (rpcError) {
        console.error('🔧 PUBLIC HOOK: RPC Error:', rpcError);
        throw new Error(`RPC Error: ${rpcError.message || rpcError}`);
      }

      console.log(`🔧 PUBLIC HOOK: Raw translations data for ${themeId}/${language}:`, data);
      console.log(`🔧 PUBLIC HOOK: Data type: ${typeof data}, Array: ${Array.isArray(data)}, Length: ${data?.length || 0}`);

      // Validate data structure
      if (!data) {
        console.warn('🔧 PUBLIC HOOK: No data returned from RPC call');
        setTranslations({});
        setError('No translation data returned');
        return;
      }

      if (!Array.isArray(data)) {
        console.error('🔧 PUBLIC HOOK: Expected array but got:', typeof data, data);
        throw new Error(`Invalid data format: expected array, got ${typeof data}`);
      }

      // Transform the data to our expected format
      const translationsMap: Translations = {};
      let validCount = 0;
      let invalidCount = 0;

      data.forEach((item: any, index: number) => {
        if (!item || typeof item !== 'object') {
          console.warn(`🔧 PUBLIC HOOK: Invalid item at index ${index}:`, item);
          invalidCount++;
          return;
        }

        if (!item.translation_key || typeof item.translation_key !== 'string') {
          console.warn(`🔧 PUBLIC HOOK: Missing or invalid translation_key at index ${index}:`, item);
          invalidCount++;
          return;
        }

        if (!item.published_value || typeof item.published_value !== 'string') {
          console.warn(`🔧 PUBLIC HOOK: Missing or invalid published_value for key "${item.translation_key}":`, item);
          invalidCount++;
          return;
        }

        translationsMap[item.translation_key] = item.published_value;
        validCount++;
      });

      console.log(`🔧 PUBLIC HOOK: Processed ${validCount} valid translations, ${invalidCount} invalid entries`);
      console.log(`🔧 PUBLIC HOOK: First 10 translation keys:`, Object.keys(translationsMap).slice(0, 10));

      setTranslations(translationsMap);
      setRetryCount(0); // Reset retry count on success
      console.log(`✅ PUBLIC HOOK: Successfully loaded ${validCount} translations`);

    } catch (error: any) {
      console.error('🔧 PUBLIC HOOK: Failed to load translations:', error);
      
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      setError(errorMessage);
      
      // Retry logic for network errors (max 3 retries)
      if (retryAttempt < 3 && !abortControllerRef.current?.signal.aborted) {
        const delay = Math.pow(2, retryAttempt) * 1000; // Exponential backoff
        console.log(`🔧 PUBLIC HOOK: Retrying in ${delay}ms (attempt ${retryAttempt + 1}/3)`);
        
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          loadTranslations(retryAttempt + 1);
        }, delay);
        return;
      }
      
      // On final failure, set empty translations so the app doesn't break
      setTranslations({});
      console.error(`🔧 PUBLIC HOOK: Final failure after ${retryAttempt + 1} attempts`);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [themeId, language]);

  useEffect(() => {
    console.log(`🔧 PUBLIC HOOK: useEffect triggered with themeId: "${themeId}", language: "${language}"`);
    
    // Reset state when dependencies change
    setError(null);
    setRetryCount(0);
    
    // Debounce rapid calls by adding a small delay
    const timeoutId = setTimeout(() => {
      loadTranslations();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
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
    error,
    retryCount,
    t,
    refreshTranslations: () => loadTranslations()
  };
};
