
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslationSubscription } from './useTranslationSubscription';
import { rebuildTranslationStructure, mergeTranslationValues } from '@/lib/translations/utils';

interface TranslationData {
  [key: string]: any;
}

interface DatabaseTranslation {
  translation_key: string;
  published_value?: string;
  draft_value?: string;
}

/**
 * ADMIN TRANSLATION SYSTEM
 * 
 * This hook loads ALL translations for admin use.
 * Shows published_value if available, falls back to draft_value for editing.
 */
export const useAdminTranslations = (themeId: string, language: 'en' | 'sv') => {
  const [translations, setTranslations] = useState<TranslationData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [source] = useState<'database'>('database');
  
  // Track current loading operation
  const currentLoadRef = useRef<{ themeId: string; language: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadTranslations = useCallback(async () => {
    // Don't load if no themeId or language
    if (!themeId || !language) {
      console.log(`🔧 ADMIN: Skipping load - missing themeId (${themeId}) or language (${language})`);
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const loadOperation = { themeId, language };
    currentLoadRef.current = loadOperation;

    setIsLoading(true);
    
    try {
      console.log(`🔧 ADMIN: Loading ALL translations for theme: ${themeId}, language: ${language}`);
      
      const { data: dbTranslations, error } = await supabase
        .from('translations')
        .select('translation_key, published_value, draft_value')
        .eq('theme_id', themeId)
        .eq('language', language)
        .abortSignal(abortControllerRef.current.signal);

      // Check if this request is still current
      if (currentLoadRef.current !== loadOperation) {
        console.log(`🔧 ADMIN: Skipping outdated load result for ${themeId}/${language}`);
        return;
      }

      if (error) {
        if (error.name === 'AbortError') {
          console.log(`🔧 ADMIN: Load aborted for ${themeId}/${language}`);
          return;
        }
        console.error('❌ Admin translation loading error:', error);
        setTranslations({});
        return;
      }

      if (dbTranslations && dbTranslations.length > 0) {
        console.log(`✅ ADMIN: Loaded ${dbTranslations.length} translations for ${themeId}/${language}`);
        
        const mergedTranslations = mergeTranslationValues(dbTranslations as DatabaseTranslation[]);
        const nestedTranslations = rebuildTranslationStructure(mergedTranslations);
        setTranslations(nestedTranslations);
        
        const publishedCount = dbTranslations.filter(t => t.published_value && !t.draft_value).length;
        const draftCount = dbTranslations.filter(t => t.draft_value).length;
        console.log(`📊 ADMIN Translation status: ${publishedCount} published, ${draftCount} with drafts`);
      } else {
        console.log(`ℹ️ ADMIN: No translations found in database for ${themeId}/${language}`);
        setTranslations({});
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`🔧 ADMIN: Load aborted for ${themeId}/${language}`);
        return;
      }
      console.error('❌ Admin translation loading error:', error);
      setTranslations({});
    } finally {
      // Only set loading to false if this is still the current operation
      if (currentLoadRef.current === loadOperation) {
        setIsLoading(false);
      }
    }
  }, [themeId, language]);

  // Clear translations immediately when themeId changes
  useEffect(() => {
    if (themeId) {
      setTranslations({});
      setIsLoading(true);
    }
  }, [themeId]);

  useEffect(() => {
    if (themeId && language) {
      loadTranslations();
    }
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [themeId, language, loadTranslations]);

  useTranslationSubscription({
    themeId,
    language,
    onUpdate: loadTranslations,
    context: 'admin'
  });

  return { translations, isLoading, source };
};
