
import type { AnalyticsEventRow } from '@/utils/analytics';

export interface ActivityStats {
  views: number;
  sessions: Set<string>;
  prompts: number;
  chats: number;
}

export const processEventByType = (
  event: AnalyticsEventRow,
  stats: ActivityStats
): void => {
  switch (event.event_type) {
    case 'page_view':
      stats.views++;
      break;
    case 'chat_prompt':
      stats.prompts++;
      break;
    case 'chat_started':
      stats.chats++;
      break;
  }
  
  // Track unique sessions
  if (event.session_id) {
    stats.sessions.add(event.session_id);
  }
};

export const validateProcessedKey = (
  key: string,
  originalDate: string,
  index: number
): boolean => {
  if (!key || key === 'Invalid Date' || key.includes('Invalid')) {
    console.error(`Invalid key generated at index ${index}:`, {
      key,
      original: originalDate
    });
    return false;
  }
  return true;
};

export const logEventProcessing = (
  event: AnalyticsEventRow,
  key: string,
  index: number,
  isMayJune: boolean
) => {
  if (isMayJune || index < 10) {
    console.log(`PROCESSING [${isMayJune ? 'MAY/JUNE CRITICAL' : 'standard'}] event ${index}:`, {
      original_date: event.created_at,
      generated_key: key,
      event_type: event.event_type
    });
  }
};
