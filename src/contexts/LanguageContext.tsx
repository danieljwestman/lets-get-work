
import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isLoading: boolean;
  t: (key: string, fallback?: string) => string;
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
    'welcome': 'Welcome',
    'loading': 'Loading...',
    'whySupport.title': 'Why Support Me?',
    'whySupport.titleMobile': 'Why Support Me?',
    'whySupport.description': 'Here are some key reasons why I would be a great addition to your team.',
    'whySupport.highlights.0.title': 'Remote Ready',
    'whySupport.highlights.0.subtitle': 'Killer Home Office',
    'whySupport.highlights.1.title': 'Part-Time',
    'whySupport.highlights.1.subtitle': 'Perfect Fit',
    'whySupport.highlights.2.title': 'Stockholm',
    'whySupport.highlights.2.subtitle': 'Local Knowledge',
    'whySupport.highlights.3.title': 'Available Now',
    'whySupport.highlights.3.subtitle': 'Ready to Start',
    'contact.title': 'Get In Touch',
    'contact.titleMobile': 'Contact',
    'contact.description': 'Ready to discuss your next project? Let\'s connect!',
    'contact.buttons.email': 'Send Email',
    'contact.buttons.github': 'GitHub',
    'contact.buttons.linkedin': 'LinkedIn',
    'contact.modal.title': 'Contact Daniel',
    'contact.form.sending': 'Sending...',
    'hero.buttons.chatWithDaniBot': 'Chat with DaniBot'
  },
  sv: {
    'welcome': 'Välkommen',
    'loading': 'Laddar...',
    'whySupport.title': 'Varför stödja mig?',
    'whySupport.titleMobile': 'Varför stödja mig?',
    'whySupport.description': 'Här är några viktiga anledningar till varför jag skulle vara ett bra tillskott till ditt team.',
    'whySupport.highlights.0.title': 'Distansredo',
    'whySupport.highlights.0.subtitle': 'Fantastiskt hemmakontor',
    'whySupport.highlights.1.title': 'Deltid',
    'whySupport.highlights.1.subtitle': 'Perfekt passform',
    'whySupport.highlights.2.title': 'Stockholm',
    'whySupport.highlights.2.subtitle': 'Lokal kunskap',
    'whySupport.highlights.3.title': 'Tillgänglig nu',
    'whySupport.highlights.3.subtitle': 'Redo att börja',
    'contact.title': 'Kontakta mig',
    'contact.titleMobile': 'Kontakt',
    'contact.description': 'Redo att diskutera ditt nästa projekt? Låt oss koppla upp oss!',
    'contact.buttons.email': 'Skicka e-post',
    'contact.buttons.github': 'GitHub',
    'contact.buttons.linkedin': 'LinkedIn',
    'contact.modal.title': 'Kontakta Daniel',
    'contact.form.sending': 'Skickar...',
    'hero.buttons.chatWithDaniBot': 'Chatta med DaniBot'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading] = useState(false);

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || key;
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
