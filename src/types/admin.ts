import type { OpportunityStatusType } from '@/constants/opportunityStatuses';

export interface Opportunity {
  id: string;
  opportunity_id: string;
  name: string;
  theme_id: string;
  company_name?: string;
  contact_person?: string;
  target_role?: string;
  notes?: string;
  status: OpportunityStatusType;
  user_id?: string;
  is_passcode_protected?: boolean;
  access_passcode?: string;
  intro_video_url_en?: string;
  intro_video_url_sv?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Theme {
  id?: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    gradients: {
      hero: string;
      primary: string;
      secondary: string;
    };
  };
  content?: {
    targetRole: string;
    industry: string;
    companySpecificSkills: string[];
    showHeroCTAs?: boolean;
  };
  danibot?: {
    personality: string;
    knowledgeBase: string;
    customGreeting?: string;
  };
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Translation {
  id?: string;
  theme_id: string;
  language: 'en' | 'sv';
  translation_key: string;
  published_value?: string;
  draft_value?: string;
  user_id?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  subject: string | null;
  message: string;
  inquiry_type: string;
  source: string;
  conversation_context: string | null;
  email_sent_successfully: boolean;
  email_id: string | null;
  user_agent: string | null;
  ip_address: unknown;
  opportunity_id: string;
  user_id?: string;
}

export interface AnalyticsEvent {
  id: string;
  created_at: string;
  opportunity_id: string;
  event_type: string;
  event_data: any;
  user_agent: string;
  ip_address: unknown;
  session_id: string;
  page_url: string;
  referrer: string | null;
  theme_id: string | null;
  user_id?: string;
}

// UI Component Props
export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}
