
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalyticsEvents } from '../services/analyticsEventService';
import { dataAggregationService } from '../services/dataAggregationService';
import { useProfile } from '@/hooks/useProfile';
import type { AnalyticsData, TimeRange, AnalyticsEventRow } from '../types/analytics';

export const useAnalyticsData = (timeRange: TimeRange, opportunityFilter: string, timezone?: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [rawEvents, setRawEvents] = useState<AnalyticsEventRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  const effectiveTimezone = timezone || profile?.timezone || 'Europe/Stockholm';

  const fetchAnalyticsData = useCallback(async () => {
    if (!user) {
      setData(null);
      setRawEvents(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching analytics data for user:', user.id);
      
      // Fetch user opportunities
      const { data: opportunities, error: opportunitiesError } = await supabase
        .from('opportunities')
        .select('opportunity_id')
        .eq('user_id', user.id);

      if (opportunitiesError) {
        console.error('Error fetching opportunities:', opportunitiesError);
        throw opportunitiesError;
      }

      let opportunityIds = opportunities?.map(opp => opp.opportunity_id) || [];

      // Apply opportunity filter
      let filteredOpportunityIds = opportunityIds;
      if (opportunityFilter !== 'all') {
        filteredOpportunityIds = opportunityIds.filter(id => id === opportunityFilter);
      }

      if (filteredOpportunityIds.length === 0 && opportunityFilter !== 'all') {
        // No matching opportunities, return empty data
        setData({
          totalViews: 0,
          uniqueSessions: 0,
          chatStarts: 0,
          chatPrompts: 0,
          githubClicks: 0,
          linkedinClicks: 0,
          emailsSent: 0,
          buttonClicks: 0,
          sectionViews: 0,
          mobileVisitors: 0,
          desktopVisitors: 0,
          englishVisitors: 0,
          swedishVisitors: 0,
          topEvents: [],
          dailyActivity: [],
          deviceBreakdown: [],
          languageBreakdown: [],
          companies: []
        });
        setRawEvents([]);
        setLoading(false);
        return;
      }

      // Fetch events with timezone awareness and pagination
      const events = await getAnalyticsEvents({
        timeRange,
        opportunityIds: filteredOpportunityIds,
        timezone: effectiveTimezone
      });

      // Store raw events for charts
      setRawEvents(events);
      
      // Process data for dashboard components
      const processedData = dataAggregationService.aggregateAnalyticsData(events, timeRange, effectiveTimezone);
      setData(processedData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setData(null);
      setRawEvents(null);
    } finally {
      setLoading(false);
    }
  }, [user, timeRange, opportunityFilter, effectiveTimezone]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    data,
    rawEvents,
    loading,
    fetchAnalyticsData
  };
};
