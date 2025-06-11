// Helper function to get human-readable event names
export const getEventDisplayName = (eventType: string): string => {
  const eventNames: Record<string, string> = {
    'page_view': 'Page Views',
    'button_click': 'Button Clicks',
    'chat_started': 'Chat Sessions Started',
    'chat_interaction': 'Chat Interactions',
    'chat_prompt': 'DaniBot Prompts',
    'email_sent': 'Emails Sent',
    'external_link_click': 'External Links Clicked',
    'section_view': 'Section Views',
    'download': 'Downloads'
  };
  
  return eventNames[eventType] || eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

import { getTimezoneAwareDateFilter } from './timezoneUtils';

export const getDateFilter = (timeRange: string, timezone: string = 'UTC') => {
  return getTimezoneAwareDateFilter(timeRange as any, timezone);
};

export const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5A2B'];
