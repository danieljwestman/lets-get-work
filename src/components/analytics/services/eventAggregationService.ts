
import type { AnalyticsEventRow } from '@/utils/analytics';
import { getEventDisplayName } from '../utils/analyticsUtils';

export const aggregateTopEvents = (events: AnalyticsEventRow[]) => {
  const eventCounts = events.reduce((acc: Record<string, number>, event) => {
    // Validate event_type to prevent injection
    if (typeof event.event_type === 'string' && event.event_type.match(/^[a-z_]+$/)) {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(eventCounts)
    .map(([event_type, count]) => ({ 
      event_type, 
      display_name: getEventDisplayName(event_type),
      count 
    }))
    .sort((a, b) => b.count - a.count);
};
