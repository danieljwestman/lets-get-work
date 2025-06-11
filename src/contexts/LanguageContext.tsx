
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOpportunity } from './OpportunityContext';
import { createSafeTranslationFunction, validateTranslations, REQUIRED_TRANSLATION_KEYS } from '@/utils/translations';
import { useTranslations } from '@/hooks/useTranslations';
import { useAdminTranslations } from '@/hooks/useAdminTranslations';
import { useTranslationReadiness } from '@/hooks/useTranslationReadiness';

type Language = 'en' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
  refreshTranslations: () => void;
  translationSource: 'database';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { opportunity } = useOpportunity();
  const [language, setLanguage] = useState<Language>('en');
  const [refreshKey, setRefreshKey] = useState(0);

  const themeId = opportunity?.theme?.theme_id || 'default';
  
  console.log(`🔧 LANGUAGE CONTEXT: Current state:`, {
    hasOpportunity: !!opportunity,
    themeId,
    language,
    opportunityName: opportunity?.name
  });
  
  // Determine if we're in admin context (dashboard route)
  const isAdminContext = window.location.pathname.includes('/dashboard');
  
  // FIXED: Simplified shouldLoadTranslations logic - load when we have both themeId and opportunity
  const shouldLoadTranslations = Boolean(themeId && opportunity);
  
  console.log(`🔧 LANGUAGE CONTEXT: Should load translations:`, {
    shouldLoadTranslations,
    themeId,
    hasOpportunity: !!opportunity,
    isAdminContext,
    reasoning: `themeId: ${!!themeId}, opportunity: ${!!opportunity}`
  });
  
  // Use appropriate hook based on context - but only when we should load
  const publicTranslations = useTranslations(
    shouldLoadTranslations ? themeId : '', 
    language
  );
  const adminTranslations = useAdminTranslations(
    shouldLoadTranslations ? themeId : '', 
    language
  );
  
  // Standardize the return types
  const translationsData = isAdminContext ? {
    translations: adminTranslations.translations,
    isLoading: adminTranslations.isLoading,
    source: adminTranslations.source
  } : {
    translations: publicTranslations.translations,
    isLoading: publicTranslations.loading,
    source: 'database' as const
  };
  
  console.log(`🔧 LANGUAGE CONTEXT: Translations data:`, {
    translationCount: Object.keys(translationsData.translations).length,
    isLoading: translationsData.isLoading,
    source: translationsData.source,
    firstFewKeys: Object.keys(translationsData.translations).slice(0, 5),
    shouldLoadTranslations,
    rawTranslationsObject: translationsData.translations
  });
  
  // DEBUG: Test specific translation access
  if (Object.keys(translationsData.translations).length > 0) {
    console.log(`🔍 TRANSLATION DEBUG: Testing key access:`, {
      'hero.title': translationsData.translations['hero.title'],
      'hero.greeting': translationsData.translations['hero.greeting'],
      'hero.description': translationsData.translations['hero.description'],
      'contact.description': translationsData.translations['contact.description'],
      allKeys: Object.keys(translationsData.translations)
    });
  }
  
  // Use translation readiness to ensure proper loading coordination
  const readinessState = useTranslationReadiness(translationsData.translations, translationsData.isLoading, language);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sv')) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('sv')) {
        setLanguage('sv');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Enhanced validation and logging
  useEffect(() => {
    if (readinessState.isReady && Object.keys(translationsData.translations).length > 0 && process.env.NODE_ENV === 'development') {
      const validation = validateTranslations(translationsData.translations, REQUIRED_TRANSLATION_KEYS);
      
      const contextLabel = isAdminContext ? 'ADMIN' : 'PUBLIC';
      console.log(`✅ ${contextLabel}: ${Object.keys(translationsData.translations).length} translations ready for ${themeId}/${language}`);
      
      if (!validation.isValid) {
        console.info(`ℹ️ ${contextLabel}: Missing translation keys:`, validation.missingKeys);
      }
      if (validation.warnings.length > 0) {
        console.warn(`${contextLabel}: Translation warnings:`, validation.warnings);
      }
    }
  }, [translationsData.translations, themeId, language, isAdminContext, readinessState.isReady]);

  const refreshTranslations = () => {
    console.log('🔄 LANGUAGE CONTEXT: Manual translation refresh requested');
    setRefreshKey(prev => prev + 1);
  };

  // FIXED: Create enhanced translation function with better debugging
  const t = (key: string, fallback?: string): string => {
    const translations = translationsData.translations;
    console.log(`🔍 TRANSLATION LOOKUP: key="${key}", hasTranslations=${Object.keys(translations).length > 0}, value="${translations[key]}", fallback="${fallback}"`);
    
    // Direct key lookup (flat structure from database)
    const value = translations[key];
    
    if (value && value.trim() !== '') {
      console.log(`✅ TRANSLATION FOUND: "${key}" = "${value}"`);
      return value;
    }

    // Use provided fallback if available
    if (fallback) {
      console.log(`🔄 TRANSLATION FALLBACK: "${key}" using fallback "${fallback}"`);
      return fallback;
    }

    // In development, show the key for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn(`🔍 Missing translation key: ${key}`);
      return `[${key}]`;
    }

    // In production, show user-friendly fallback
    const keyParts = key.split('.');
    const lastPart = keyParts[keyParts.length - 1];
    
    // Convert camelCase or snake_case to readable text
    const readableText = lastPart
      .replace(/([A-Z])/g, ' $1') // camelCase to spaces
      .replace(/_/g, ' ') // snake_case to spaces
      .replace(/^\w/, c => c.toUpperCase()) // capitalize first letter
      .trim();
    
    const result = readableText || 'Content';
    console.log(`🔄 TRANSLATION DEFAULT: "${key}" using default "${result}"`);
    return result;
  };

  // Use readiness state for loading - this ensures we don't show content until translations are properly loaded
  const isLoading = !shouldLoadTranslations ? false : (readinessState.isLoading || !readinessState.isReady);

  console.log(`🔧 LANGUAGE CONTEXT: Final state:`, {
    isLoading,
    isReady: readinessState.isReady,
    shouldLoadTranslations,
    translationCount: Object.keys(translationsData.translations).length,
    translationFunctionType: typeof t
  });

  if (isLoading && Object.keys(translationsData.translations).length === 0) {
    console.log(`⏳ ${isAdminContext ? 'ADMIN' : 'PUBLIC'}: Waiting for translations to be ready...`);
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      isLoading,
      refreshTranslations,
      translationSource: 'database'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
