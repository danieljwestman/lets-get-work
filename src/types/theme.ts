
export interface Theme {
  id?: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    gradients: {
      hero: string;
      primary: string;
      secondary: string;
    };
  };
  content: {
    targetRole: string;
    industry: string;
    companySpecificSkills: string[];
    showHeroCTAs?: boolean;
  };
  danibot: {
    personality: string;
    knowledgeBase: string;
    customGreeting?: string;
  };
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  browserTitle?: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    gradients: {
      hero: string;
      primary: string;
      secondary: string;
    };
  };
  content: {
    targetRole: string;
    industry: string;
    companySpecificSkills: string[];
    hiddenSections?: string[];
    showHeroCTAs?: boolean;
    customCTA?: {
      primary: string;
      secondary: string;
    };
  };
  daniBot: {
    personality: string;
    knowledgeBase: string;
    customGreeting?: string;
  };
}
