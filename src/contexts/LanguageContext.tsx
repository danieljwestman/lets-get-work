
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

// Comprehensive translations object
const translations: Record<string, Record<string, string>> = {
  en: {
    'welcome': 'Welcome',
    'loading': 'Loading...',
    'header.badge': 'Hire Daniel Now',
    'hero.badge': 'Hire Daniel Now',
    'hero.title': 'Where Creative Ideas Click',
    'hero.greeting': 'Hello! I\'m Daniel 👋',
    'hero.description': 'Experienced customer success professional with a passion for technology, design, and helping people succeed. I love making complex things simple — combining AI expertise, creative thinking, and a sharp eye for design to turn ideas into user-friendly solutions. Always learning, always improving!',
    'hero.buttons.getToKnow': 'Learn about me',
    'hero.buttons.letsTalk': 'Get in touch',
    'hero.buttons.chatWithDaniBot': 'Chat with DaniBot',
    'about.title': 'Your Next Customer Experience Champion 🏆',
    'about.titleMobile': 'Your Next Customer Experience Champion',
    'about.description': 'Native Swedish, fluent in English, and remote-ready with a pro home office. Based near Stockholm and familiar with Lovable\'s workspace in Waterfront Building. Open to full- or part-time — excited to join Lovable\'s next chapter!',
    'about.videoTitle': 'Meet Daniel',
    'about.videoDescription': 'Click to watch my introduction',
    'about.contentTitle': 'Tech + Heart + Empowerment 💝',
    'about.contentTitleMobile': 'Tech + Heart + Empowerment',
    'about.contentParagraph1': 'I get tech, but more importantly - I get people! Having built SaaS platforms myself with over 100,000+ users, I understand both the technical challenges and the human frustration when things don\'t work.',
    'about.contentParagraph2': 'That\'s where magic happens: turning complex challenges into simple solutions!',
    'about.contentParagraph3': 'When I\'m not empowering users to succeed, you\'ll find me building things with my hands (amateur carpenter at heart!) or chasing after my three kids with my wonderful wife. Same attention to detail, different tools!',
    'about.contentParagraph3Mobile': 'When I\'m not empowering users to succeed, you\'ll find me building things with my hands (amateur carpenter at heart!) or chasing after my three kids with my wonderful wife. Same attention to detail, different tools!',
    'skills.title': 'My Customer Success Expertise 💎',
    'skills.titleMobile': 'My Customer Success Expertise',
    'skills.description': 'The perfect blend of technical expertise and people skills to make users and customers delighted!',
    'tools.title': 'Tech Stack & Tools 🛠️',
    'tools.description': 'Comfortable with the tools that make great support happen! Always curious and love exploring new trending tools!',
    'tools.footer': 'Always learning, always improving!',
    'experience.title': 'My Journey to Customer Experience Excellence 🌟',
    'experience.titleMobile': 'My Journey to Customer Experience Excellence',
    'experience.description': 'From university experiments to building platforms used by 100,000+ people — every step has fueled my passion for thoughtful design, user-focused development, and the powerful possibilities of AI.',
    'whySupport.title': 'Customer + Daniel = Success! ✨',
    'whySupport.titleMobile': 'Customer + Daniel = Success!',
    'whySupport.description': 'I\'ve been on both sides - building tools AND desperately needing great support! I know what it feels like to be stuck, and I live for those aha! moments when everything clicks. Let me help your users discover the joy of effortless building - especially in the Support Specialist role!',
    'whySupport.highlights.0.title': 'Remote Ready',
    'whySupport.highlights.0.subtitle': 'Killer Home Office',
    'whySupport.highlights.1.title': 'Part-Time',
    'whySupport.highlights.1.subtitle': 'Perfect Fit',
    'whySupport.highlights.2.title': 'Stockholm',
    'whySupport.highlights.2.subtitle': 'Local Knowledge',
    'whySupport.highlights.3.title': 'Available Now',
    'whySupport.highlights.3.subtitle': 'Ready to Start',
    'inquiryTypes.title': 'How Can I Help Your Team? 👥',
    'inquiryTypes.titleMobile': 'How Can I Help Your Team?',
    'inquiryTypes.description': 'I\'m open to different types of professional engagements. Here\'s how we could work together:',
    'inquiryTypes.types.partTime.title': 'Part-Time Hire',
    'inquiryTypes.types.partTime.description': 'Perfect for ongoing projects that need consistent attention without full-time commitment.',
    'inquiryTypes.types.partTime.benefit1': 'Flexible scheduling',
    'inquiryTypes.types.partTime.benefit2': 'Cost-effective solution',
    'inquiryTypes.types.fullTime.title': 'Full-Time Hire',
    'inquiryTypes.types.fullTime.description': 'Ready to fully commit to your team\'s mission and grow together long-term.',
    'inquiryTypes.types.fullTime.benefit1': 'Complete dedication',
    'inquiryTypes.types.fullTime.benefit2': 'Long-term partnership',
    'inquiryTypes.types.consultancy.title': 'Consultancy',
    'inquiryTypes.types.consultancy.description': 'Strategic guidance and expertise for specific challenges or project phases.',
    'inquiryTypes.types.consultancy.benefit1': 'Expert insights',
    'inquiryTypes.types.consultancy.benefit2': 'Quick implementation',
    'contact.title': 'Let\'s Connect! 🚀',
    'contact.titleMobile': 'Let\'s Connect!',
    'contact.description': 'I\'m passionate about discussing user experience, technology, and design innovation. Whether it\'s crafting intuitive interfaces, solving complex technical challenges, or creating seamless digital experiences, I\'d love to explore how my expertise in UX and tech can contribute to your team\'s vision.',
    'contact.buttons.email': 'Send an email',
    'contact.buttons.github': 'GitHub Profile',
    'contact.buttons.linkedin': 'LinkedIn Profile',
    'contact.modal.title': 'Contact Daniel',
    'contact.form.sending': 'Sending...',
    'footer.text': 'Crafted with ❤️ and powered by Lovable - where great ideas become reality! ✨'
  },
  sv: {
    'welcome': 'Välkommen',
    'loading': 'Laddar...',
    'header.badge': 'Anlita Daniel nu',
    'hero.badge': 'Anlita Daniel nu',
    'hero.title': 'Där Kreativa Idéer Klickar',
    'hero.greeting': 'Hej! Jag heter Daniel 👋',
    'hero.description': 'Erfaren specialist inom IT med passion för teknik, design och att hjälpa användare lyckas. Jag brinner för att göra det komplexa enkelt — och omvandlar idéer till användarvänliga lösningar med hjälp av djup teknisk förståelse, AI-kompetens, kreativt tänkande och ett skarpt öga för design.\n\nStändigt nyfiken, ständigt i utveckling.',
    'hero.buttons.getToKnow': 'Lär dig om mig',
    'hero.buttons.letsTalk': 'Kontakta mig',
    'hero.buttons.chatWithDaniBot': 'Chatta med DaniBot',
    'about.title': 'Er Nästa Customer Experience Champion 🏆',
    'about.titleMobile': 'Er Nästa Customer Experience Champion',
    'about.description': 'Modersmål svenska, flytande engelska, och redo för distansarbete med en professionell hemmakontor. Bor nära Stockholm och bekant med Lovables arbetsplats i Waterfront Building. Öppen för hel- eller deltid — taggad på att vara med i Lovables nästa kapitel!',
    'about.videoTitle': 'Träffa Daniel',
    'about.videoDescription': 'Klicka för att se min presentation',
    'about.contentTitle': 'Teknik + Hjärta + Engagemang 💝',
    'about.contentTitleMobile': 'Teknik + Hjärta + Engagemang',
    'about.contentParagraph1': 'Jag förstår teknik, men ännu viktigare - jag förstår människor! Eftersom jag själv byggt SaaS-plattformar med över 100 000+ användare, förstår jag både de tekniska utmaningarna och den mänskliga frustrationen när saker inte fungerar.',
    'about.contentParagraph2': 'Det är där magin händer: att förvandla komplexa utmaningar till enkla lösningar!',
    'about.contentParagraph3': 'När jag inte hjälper användare att lyckas, hittar du mig byggande saker med händerna (hantverkare på hjärtat!) eller springande efter mina tre barn med min underbara fru. Samma uppmärksamhet på detaljer, olika verktyg!',
    'about.contentParagraph3Mobile': 'När jag inte hjälper användare att lyckas, hittar du mig byggande saker med händerna (hantverkare på hjärtat!) eller springande efter mina tre barn med min underbara fru. Samma uppmärksamhet på detaljer, olika verktyg!',
    'skills.title': 'Mina Customer Success Expertområden 💎',
    'skills.titleMobile': 'Mina Customer Success Expertområden',
    'skills.description': 'Den perfekta blandningen av teknisk expertis och interpersonella färdigheter för att få användare och kunder mer än nöjda!',
    'tools.title': 'Teknikstack & Verktyg 🛠️',
    'tools.description': 'Bekväm med verktygen som får bra support att fungera! Alltid nyfiken och älskar att utforska nya trendiga verktyg!',
    'tools.footer': 'Lär mig alltid, utvecklas alltid!',
    'experience.title': 'Min Resa till Customer Experience Excellence 🌟',
    'experience.titleMobile': 'Min Resa till Customer Experience Excellence',
    'experience.description': 'Från universitetsexperiment till att bygga plattformar som betjänar 100 000+ användare — varje steg har lärt mig något om design, användarbehov och vad som gör människor nöjda med sina verktyg.',
    'whySupport.title': 'Kund + Daniel = Framgång! ✨',
    'whySupport.titleMobile': 'Kund + Daniel = Framgång!',
    'whySupport.description': 'Jag har varit på båda sidor - byggt verktyg OCH desperat behövt bra support! Jag vet hur det känns att vara fast, och jag lever för de där aha!-momenten när allt klickar. Låt mig hjälpa era användare att upptäcka glädjen i problemfritt byggande - särskilt i rollen som Support Specialist!',
    'whySupport.highlights.0.title': 'Distansarbete Redo',
    'whySupport.highlights.0.subtitle': 'Professionell Hemmakontor',
    'whySupport.highlights.1.title': 'Deltid',
    'whySupport.highlights.1.subtitle': 'Perfekt Match',
    'whySupport.highlights.2.title': 'Stockholm',
    'whySupport.highlights.2.subtitle': 'Lokal Kunskap',
    'whySupport.highlights.3.title': 'Tillgänglig Nu',
    'whySupport.highlights.3.subtitle': 'Redo att Börja',
    'inquiryTypes.title': 'Hur kan jag hjälpa ditt team? 🤝',
    'inquiryTypes.titleMobile': 'Hur kan jag hjälpa ditt team?',
    'inquiryTypes.description': 'Jag är öppen för olika typer av professionella engagemang. Så här skulle vi kunna arbeta tillsammans:',
    'inquiryTypes.types.partTime.title': 'Deltidsanställning',
    'inquiryTypes.types.partTime.description': 'Perfekt för pågående projekt som behöver konsekvent uppmärksamhet utan heltidsengagemang.',
    'inquiryTypes.types.partTime.benefit1': 'Flexibel schemaläggning',
    'inquiryTypes.types.partTime.benefit2': 'Kostnadseffektiv lösning',
    'inquiryTypes.types.fullTime.title': 'Heltidsanställning',
    'inquiryTypes.types.fullTime.description': 'Redo att fullt ut engagera mig i ditt teams mission och växa tillsammans långsiktigt.',
    'inquiryTypes.types.fullTime.benefit1': 'Fullständig dedikation',
    'inquiryTypes.types.fullTime.benefit2': 'Långsiktigt partnerskap',
    'inquiryTypes.types.consultancy.title': 'Konsultuppdrag',
    'inquiryTypes.types.consultancy.description': 'Strategisk vägledning och expertis för specifika utmaningar eller projektfaser.',
    'inquiryTypes.types.consultancy.benefit1': 'Expertinsikter',
    'inquiryTypes.types.consultancy.benefit2': 'Snabb implementation',
    'contact.title': 'Låt oss prata! 🚀',
    'contact.titleMobile': 'Låt oss prata!',
    'contact.description': 'Jag brinner för att diskutera användarupplevelse, teknik och designinnovation. Oavsett om det handlar om att skapa intuitiva gränssnitt, lösa komplexa tekniska utmaningar eller skapa sömlösa digitala upplevelser, skulle jag gärna utforska hur min expertis inom UX och teknik kan bidra till ert teams vision.',
    'contact.buttons.email': 'Skicka ett mejl',
    'contact.buttons.github': 'GitHub Profil',
    'contact.buttons.linkedin': 'LinkedIn Profil',
    'contact.modal.title': 'Kontakta Daniel',
    'contact.form.sending': 'Skickar...',
    'footer.text': 'Skapad med ❤️ och driven av Lovable - där innovativa idéer blir verklighet! ✨'
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
