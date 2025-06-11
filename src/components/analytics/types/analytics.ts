import type { AnalyticsEventRow as UtilsAnalyticsEventRow } from '@/utils/analytics';

// Re-export the type from utils
export type AnalyticsEventRow = UtilsAnalyticsEventRow;

export interface AnalyticsData {
  totalViews: number;
  uniqueSessions: number;
  chatStarts: number;
  chatPrompts: number;
  githubClicks: number;
  linkedinClicks: number;
  emailsSent: number;
  buttonClicks: number;
  sectionViews: number;
  mobileVisitors: number;
  desktopVisitors: number;
  englishVisitors: number;
  swedishVisitors: number;
  topEvents: Array<{
    event_type: string;
    display_name: string;
    count: number;
  }>;
  dailyActivity: Array<{
    date: string;
    views: number;
    sessions: number;
    prompts: number;
    chats: number;
  }>;
  deviceBreakdown: Array<{
    device_type: string;
    count: number;
    percentage: number;
  }>;
  languageBreakdown: Array<{
    language: string;
    count: number;
    percentage: number;
  }>;
  companies: string[];
}

export type TimeRange = '1h' | '1d' | '30d' | '1y' | 'all';
