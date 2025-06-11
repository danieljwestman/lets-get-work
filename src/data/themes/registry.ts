
import { ThemeConfig } from '@/types/theme';

export const themeRegistry: Record<string, ThemeConfig> = {
  lovable: {
    id: 'lovable',
    name: 'Lovable Theme',
    browserTitle: 'Daniel Westman - Lovable Application',
    branding: {
      primaryColor: 'blue-600',
      secondaryColor: 'purple-600',
      accentColor: 'pink-600',
      gradients: {
        hero: 'from-blue-50 via-purple-50 to-pink-50',
        primary: 'from-blue-600 to-purple-600',
        secondary: 'from-purple-600 to-pink-600'
      }
    },
    content: {
      targetRole: 'Support Specialist',
      industry: 'AI/SaaS',
      companySpecificSkills: [
        'AI Tools', 'Customer Success', 'Technical Support', 'SaaS Platforms'
      ],
      customCTA: {
        primary: 'Join Lovable Team',
        secondary: 'Chat with DaniBot'
      }
    },
    daniBot: {
      personality: 'friendly',
      knowledgeBase: 'lovable-focused',
      customGreeting: "Hi there! 👋 I'm DaniBot, Daniel's personal AI assistant. I'm here to share everything about Daniel's customer success expertise, technical skills, and professional background. What would you like to know?"
    }
  },
  default: {
    id: 'default',
    name: 'Default Theme',
    browserTitle: 'Daniel Westman - Customer Success Specialist',
    branding: {
      primaryColor: 'blue-600',
      secondaryColor: 'purple-600',
      accentColor: 'green-600',
      gradients: {
        hero: 'from-blue-50 via-gray-50 to-green-50',
        primary: 'from-blue-600 to-green-600',
        secondary: 'from-green-600 to-blue-600'
      }
    },
    content: {
      targetRole: 'Customer Success Specialist',
      industry: 'Technology',
      companySpecificSkills: [
        'Customer Success', 'Technical Support', 'SaaS Platforms', 'Problem Solving'
      ],
      hiddenSections: ['about', 'skills', 'tools', 'experience', 'whySupport'],
      showHeroCTAs: false
    },
    daniBot: {
      personality: 'professional',
      knowledgeBase: 'general',
      customGreeting: "Hello! 👋 I'm DaniBot, Daniel's personal AI assistant. I'm here to help you learn about Daniel's experience in customer success, technical expertise, and professional journey. How can I help you today?"
    }
  }
};

export const getThemeConfig = (themeId: string): ThemeConfig => {
  return themeRegistry[themeId] || themeRegistry.default;
};
