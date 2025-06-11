
import { supabase } from '@/integrations/supabase/client';
import type { TimeRange } from '../types/analytics';
import type { AnalyticsEventRow } from '@/utils/analytics';
import { getTimezoneAwareDateFilter } from '../utils/timezoneUtils';

interface GetAnalyticsEventsParams {
  timeRange: TimeRange;
  opportunityIds: string[];
  timezone?: string;
}

export const getAnalyticsEvents = async (params: GetAnalyticsEventsParams): Promise<AnalyticsEventRow[]> => {
  const { timeRange, opportunityIds, timezone = 'Europe/Stockholm' } = params;
  
  console.log('Analytics: Fetching events with pagination for', opportunityIds.length, 'opportunities');

  const allEvents: AnalyticsEventRow[] = [];
  let page = 0;
  const pageSize = 1000; // PostgREST's maximum
  let hasMore = true;

  while (hasMore) {
    const offset = page * pageSize;
    
    let query = supabase
      .from('analytics_events')
      .select('*')
      .in('opportunity_id', opportunityIds)
      .order('created_at', { ascending: true })
      .range(offset, offset + pageSize - 1);

    // Apply timezone-aware date filtering for shorter time ranges only
    if (timeRange !== 'all' && timeRange !== '1y') {
      const dateFilter = getTimezoneAwareDateFilter(timeRange, timezone);
      if (dateFilter) {
        query = query.gte('created_at', dateFilter);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Analytics: Database query error:', error);
      throw error;
    }

    if (data && data.length > 0) {
      allEvents.push(...data);
      
      if (data.length < pageSize) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }

    page++;

    // Safety check to prevent infinite loops
    if (page > 50) {
      console.warn('Analytics: Safety limit reached, stopping pagination');
      break;
    }
  }

  console.log(`Analytics: Fetched ${allEvents.length} events total`);
  return allEvents;
};
