

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MousePointer, Globe, Users } from 'lucide-react';
import { COLORS } from '../utils/analyticsUtils';
import type { AnalyticsData, TimeRange } from '../types/analytics';

interface AnalyticsEngagementProps {
  data: AnalyticsData;
  timeRange?: TimeRange;
  timezone?: string;
}

export const AnalyticsEngagement: React.FC<AnalyticsEngagementProps> = ({ 
  data, 
  timeRange = 'all',
  timezone = 'UTC'
}) => {
  const getEngagementDescription = (timeRange: TimeRange) => {
    switch (timeRange) {
      case '1h':
        return 'Last Hour';
      case '1d':
        return 'Last 24 Hours';
      case '30d':
        return 'Last 30 Days';
      case '1y':
        return 'Last Year';
      case 'all':
        return 'All Time';
      default:
        return 'Selected Period';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Engagement Actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">User Engagement</CardTitle>
          <p className="text-sm text-muted-foreground">{getEngagementDescription(timeRange)} Activity</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{data.emailsSent}</div>
              <div className="text-xs text-blue-700 font-medium">Emails Sent</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
              <MousePointer className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600">{data.buttonClicks}</div>
              <div className="text-xs text-gray-700 font-medium">Button Clicks</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{data.githubClicks}</div>
              <div className="text-xs text-purple-700 font-medium">GitHub Visits</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{data.linkedinClicks}</div>
              <div className="text-xs text-blue-700 font-medium">LinkedIn Visits</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Events */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Most Popular Actions</CardTitle>
          <p className="text-sm text-muted-foreground">{getEngagementDescription(timeRange)} Events</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {data.topEvents.slice(0, 6).map((event, index) => (
              <div key={event.event_type} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium text-sm">{event.display_name}</span>
                </div>
                <Badge variant="secondary" className="text-sm px-2 py-0.5">{event.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

