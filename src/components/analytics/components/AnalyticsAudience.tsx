

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from '../utils/analyticsUtils';
import type { AnalyticsData, TimeRange } from '../types/analytics';

interface AnalyticsAudienceProps {
  data: AnalyticsData;
  timeRange?: TimeRange;
  timezone?: string;
}

export const AnalyticsAudience: React.FC<AnalyticsAudienceProps> = ({ 
  data, 
  timeRange = 'all',
  timezone = 'UTC'
}) => {
  const getAudienceDescription = (timeRange: TimeRange) => {
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
      {/* Device Distribution */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Device Types</CardTitle>
          <p className="text-sm text-muted-foreground">{getAudienceDescription(timeRange)} Visitors</p>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.deviceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ device_type, percentage }) => `${device_type} ${percentage}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="count"
              >
                {data.deviceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Language Distribution */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Language Preferences</CardTitle>
          <p className="text-sm text-muted-foreground">{getAudienceDescription(timeRange)} Preferences</p>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.languageBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ language, percentage }) => `${language} ${percentage}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="count"
              >
                {data.languageBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

