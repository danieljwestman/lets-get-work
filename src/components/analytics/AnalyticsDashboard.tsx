
import React, { useState, useEffect } from 'react';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { AnalyticsMetrics } from './components/AnalyticsMetrics';
import { AnalyticsEngagement } from './components/AnalyticsEngagement';
import { AnalyticsAudience } from './components/AnalyticsAudience';
import { AnalyticsDemoManager } from './components/AnalyticsDemoManager';
import { TimezoneSelector } from './components/TimezoneSelector';
import { Card, CardContent } from '@/components/ui/card';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { useOpportunityOptions } from '../admin/services/opportunityFilterService';
import { useProfile } from '@/hooks/useProfile';
import { domainConfig } from '@/services/domainConfig';
import type { TimeRange } from './types/analytics';
import { ActivityTrendsChart } from './components/ActivityTrendsChart';

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [opportunityFilter, setOpportunityFilter] = useState<string>('all');
  const { profile } = useProfile();
  const [isDev, setIsDev] = useState<boolean>(false);
  
  const [timezone, setTimezone] = useState<string>(() => {
    // Get from shared localStorage or default to user's preferred timezone or Europe/Stockholm
    return localStorage.getItem('dashboard-timezone') || 
           profile?.timezone || 
           'Europe/Stockholm';
  });

  const { data, loading, fetchAnalyticsData, rawEvents } = useAnalyticsData(timeRange, opportunityFilter, timezone);
  const { opportunities, loading: opportunitiesLoading } = useOpportunityOptions();

  // Check if we're in dev mode using Supabase ENV
  useEffect(() => {
    const checkDevMode = async () => {
      try {
        const devMode = await domainConfig.isDev();
        setIsDev(devMode);
      } catch (error) {
        console.warn('Failed to check dev mode, defaulting to false:', error);
        setIsDev(false);
      }
    };
    
    checkDevMode();
  }, []);

  // Update timezone when user profile loads with preferred timezone
  useEffect(() => {
    if (profile?.timezone) {
      setTimezone(profile.timezone);
    }
  }, [profile?.timezone]);

  // Save timezone preference to shared localStorage
  useEffect(() => {
    localStorage.setItem('dashboard-timezone', timezone);
  }, [timezone]);

  if (loading || opportunitiesLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <AnalyticsHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        companyFilter={opportunityFilter}
        setCompanyFilter={setOpportunityFilter}
        opportunities={opportunities}
        onRefresh={fetchAnalyticsData}
        timezone={timezone}
      />

      <AnalyticsMetrics 
        data={data} 
        timeRange={timeRange}
        timezone={timezone}
      />

      <ActivityTrendsChart 
        events={rawEvents || []} 
        timeRange={timeRange} 
        timezone={timezone}
      />

      <AnalyticsEngagement 
        data={data} 
        timeRange={timeRange}
        timezone={timezone}
      />

      <AnalyticsAudience 
        data={data} 
        timeRange={timeRange}
        timezone={timezone}
      />

      {/* Timezone Selector with card styling */}
      <div className="flex justify-center">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <TimezoneSelector 
              selectedTimezone={timezone}
              onTimezoneChange={setTimezone}
            />
          </CardContent>
        </Card>
      </div>

      {/* Demo manager only in dev mode */}
      {isDev && (
        <AnalyticsDemoManager onDataChange={fetchAnalyticsData} />
      )}
    </div>
  );
};
