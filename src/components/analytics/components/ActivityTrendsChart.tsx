
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityTrendsChartContainer } from './ActivityTrendsChartContainer';
import { processEventsToActivityData } from '../services/activityTrends/dataProcessor';
import type { AnalyticsEventRow } from '@/utils/analytics';
import type { TimeRange } from '../types/analytics';

interface ActivityTrendsChartProps {
  events: AnalyticsEventRow[];
  timeRange: TimeRange;
  timezone?: string;
}

export const ActivityTrendsChart: React.FC<ActivityTrendsChartProps> = ({ 
  events, 
  timeRange,
  timezone = 'UTC'
}) => {
  console.log('ActivityTrendsChart: Processing', events.length, 'events for timeRange:', timeRange, 'timezone:', timezone);
  
  const activityData = processEventsToActivityData(events, timezone);
  
  console.log('ActivityTrendsChart: Generated', activityData.length, 'data points');

  if (activityData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No activity data available for the selected period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityTrendsChartContainer 
          data={activityData} 
          timeRange={timeRange}
          timezone={timezone}
        />
      </CardContent>
    </Card>
  );
};
