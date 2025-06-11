
import { TranslationFunction } from '@/types/translations';

// Simple translation function type
export type SafeTranslationFunction = (key: string, fallback?: string) => string;

// Create a simple translation function
export const createSafeTranslationFunction = (translations: Record<string, string>): SafeTranslationFunction => {
  return (key: string, fallback?: string): string => {
    const value = translations[key];
    
    if (value && value.trim() !== '') {
      return value;
    }
    
    // Use provided fallback if available
    if (fallback) {
      return fallback;
    }
    
    // In development, show the key for debugging
    if (process.env.NODE_ENV === 'development') {
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
    
    return readableText || 'Content';
  };
};

// Required translation keys for validation
export const REQUIRED_TRANSLATION_KEYS = [
  'hero.title',
  'hero.greeting',
  'hero.description',
  'about.title',
  'skills.title',
  'experience.title',
  'contact.title'
];

// Enhanced validation function
export const validateTranslations = (
  translations: Record<string, any>,
  requiredKeys: string[] = REQUIRED_TRANSLATION_KEYS
): { isValid: boolean; missingKeys: string[]; warnings: string[] } => {
  if (process.env.NODE_ENV !== 'development') {
    return { isValid: true, missingKeys: [], warnings: [] };
  }

  const missingKeys: string[] = [];
  const warnings: string[] = [];
  
  requiredKeys.forEach(key => {
    if (!hasNestedKey(translations, key)) {
      missingKeys.push(key);
    }
  });

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    warnings
  };
};

// Enhanced translation utilities
export const createTranslationHelpers = (t: TranslationFunction) => {
  return {
    // Safe translation with fallback
    safeT: (key: string, fallback?: string) => {
      const translation = t(key);
      return translation === key ? (fallback || key) : translation;
    },

    // Pluralization helper
    pluralize: (key: string, count: number, options?: { 
      zero?: string; 
      one?: string; 
      other?: string;
    }) => {
      if (count === 0 && options?.zero) return options.zero;
      if (count === 1 && options?.one) return options.one;
      if (options?.other) return options.other.replace('{{count}}', count.toString());
      
      return t(count === 1 ? `${key}.one` : `${key}.other`).replace('{{count}}', count.toString());
    },

    // Interpolation helper
    interpolate: (key: string, variables: Record<string, string | number>) => {
      let translation = t(key);
      
      Object.entries(variables).forEach(([variable, value]) => {
        translation = translation.replace(
          new RegExp(`{{${variable}}}`, 'g'),
          value.toString()
        );
      });
      
      return translation;
    },

    // Date formatting helper
    formatDate: (date: Date, format: 'short' | 'long' | 'relative' = 'short') => {
      const locale = getCurrentLocale();
      
      switch (format) {
        case 'short':
          return date.toLocaleDateString(locale);
        case 'long':
          return date.toLocaleDateString(locale, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        case 'relative':
          return getRelativeTime(date, locale);
        default:
          return date.toLocaleDateString(locale);
      }
    },

    // Number formatting helper
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) => {
      const locale = getCurrentLocale();
      return new Intl.NumberFormat(locale, options).format(number);
    },

    // Currency formatting helper
    formatCurrency: (amount: number, currency = 'USD') => {
      const locale = getCurrentLocale();
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
      }).format(amount);
    }
  };
};

// Get current locale from context or browser
const getCurrentLocale = (): string => {
  // This would be enhanced to get from language context
  return typeof navigator !== 'undefined' ? navigator.language : 'en-US';
};

// Relative time formatting
const getRelativeTime = (date: Date, locale: string): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
        .format(-count, interval.label as Intl.RelativeTimeFormatUnit);
    }
  }

  return 'now';
};

// Translation key validation (development only)
export const validateTranslationKeys = (
  translations: Record<string, any>,
  requiredKeys: string[]
): { valid: boolean; missing: string[] } => {
  if (process.env.NODE_ENV !== 'development') {
    return { valid: true, missing: [] };
  }

  const missing: string[] = [];
  
  requiredKeys.forEach(key => {
    if (!hasNestedKey(translations, key)) {
      missing.push(key);
    }
  });

  return {
    valid: missing.length === 0,
    missing
  };
};

// Helper to check nested keys
const hasNestedKey = (obj: any, key: string): boolean => {
  const keys = key.split('.');
  let current = obj;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return false;
    }
  }
  
  return current !== undefined;
};

// Namespace helper for organizing translations
export const createNamespacedTranslations = (namespace: string) => {
  return (t: TranslationFunction) => ({
    t: (key: string) => t(`${namespace}.${key}`),
    namespace
  });
};
