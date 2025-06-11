
import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple translations object for now
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    loading: 'Loading...',
  },
  sv: {
    welcome: 'Välkommen',
    loading: 'Laddar...',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading] = useState(false);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      isLoading,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
