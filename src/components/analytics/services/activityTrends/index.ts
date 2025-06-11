
import type { AnalyticsEventRow } from '@/utils/analytics';
import type { TimeRange } from '../../types/analytics';
import type { ActivityTrendsData } from './types';
import { processEventsToActivityData } from './dataProcessor';
import { formatChartDate } from './dateFormatter';

export type { ActivityTrendsData } from './types';

export const processActivityTrends = (
  events: AnalyticsEventRow[], 
  timeRange: TimeRange
): ActivityTrendsData[] => {
  return processEventsToActivityData(events);
};

export { formatChartDate };
