
export type TranslationFunction = (key: string, fallback?: string) => string;

// Add the missing types that are being imported
export interface Translations {
  [key: string]: string;
}

export interface PublicTranslations {
  [key: string]: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface InquiryType {
  title: string;
  description: string;
  benefit1: string;
  benefit2: string;
}

export interface TranslationKeys {
  hero: {
    badge: string;
    title: string;
    greeting: string;
    description: string;
    buttons: {
      getToKnow: string;
      letsTalk: string;
      chatWithDaniBot: string;
    };
  };
  about: {
    title: string;
    titleMobile: string;
    description: string;
    videoTitle: string;
    videoDescription: string;
    contentTitle: string;
    contentTitleMobile: string;
    contentParagraph1: string;
    contentParagraph2: string;
    contentParagraph3: string;
    contentParagraph3Mobile: string;
  };
  skills: {
    title: string;
    titleMobile: string;
    description: string;
  };
  tools: {
    title: string;
    description: string;
    footer: string;
  };
  experience: {
    title: string;
    titleMobile: string;
    description: string;
    items: ExperienceItem[];
  };
  whySupport: {
    title: string;
    titleMobile: string;
    description: string;
    highlights: Array<{
      title: string;
      subtitle: string;
    }>;
  };
  inquiryTypes: {
    title: string;
    titleMobile: string;
    description: string;
    types: {
      partTime: InquiryType;
      fullTime: InquiryType;
      consultancy: InquiryType;
    };
  };
  contact: {
    title: string;
    titleMobile: string;
    description: string;
    buttons: {
      email: string;
      github: string;
      linkedin: string;
    };
  };
}
