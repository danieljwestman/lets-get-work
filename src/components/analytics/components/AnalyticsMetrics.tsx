

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Eye, 
  Users, 
  Bot, 
  MousePointer
} from 'lucide-react';
import type { AnalyticsData, TimeRange } from '../types/analytics';

interface AnalyticsMetricsProps {
  data: AnalyticsData;
  timeRange: TimeRange;
  timezone: string;
}

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ 
  data,
  timeRange,
  timezone
}) => {
  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case '1h': return 'Last hour';
      case '1d': return 'Last day';
      case '30d': return 'Last 30 days';
      case '1y': return 'Last year';
      case 'all': return 'All time';
      default: return range;
    }
  };

  const mainMetrics = [
    {
      title: 'Total Views',
      value: data.totalViews,
      subtitle: getTimeRangeLabel(timeRange),
      icon: Eye,
      iconColor: 'text-blue-600'
    },
    {
      title: 'Unique Sessions',
      value: data.uniqueSessions,
      subtitle: getTimeRangeLabel(timeRange),
      icon: Users,
      iconColor: 'text-green-600'
    },
    {
      title: 'Chat Interactions',
      value: data.chatStarts + data.chatPrompts,
      subtitle: 'Starts + prompts',
      icon: Bot,
      iconColor: 'text-purple-600'
    },
    {
      title: 'Button Clicks',
      value: data.buttonClicks + data.githubClicks + data.linkedinClicks,
      subtitle: 'All interactions',
      icon: MousePointer,
      iconColor: 'text-orange-600'
    }
  ];

  const renderMetricCard = (metric: any, index: number) => (
    <Card key={index} className="border-l-4 border-l-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.title}
        </CardTitle>
        <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${metric.iconColor}`}>
          {metric.value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainMetrics.map(renderMetricCard)}
      </div>
    </div>
  );
};

