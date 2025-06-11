
import React from 'react';
import { formatTooltipDateInTimezone } from '../utils/timezoneUtils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  timeRange?: string;
  timezone?: string;
}

const getMetricLabel = (dataKey: string): string => {
  switch (dataKey) {
    case 'totalViews':
      return 'Total Views';
    case 'uniqueSessions':
      return 'Unique Sessions';
    case 'chatInteractions':
      return 'Chat Interactions';
    case 'buttonClicks':
      return 'Button Clicks';
    default:
      return dataKey;
  }
};

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label,
  timeRange = '30d',
  timezone = 'UTC'
}) => {
  if (active && payload && payload.length) {
    // Find the original date for proper formatting
    const dataPoint = payload[0]?.payload;
    const originalDate = dataPoint?.originalDate || label;
    
    // Format the date based on time range
    const formattedLabel = formatTooltipDateInTimezone(originalDate, timeRange as any, timezone);
    
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="text-sm font-medium text-foreground mb-2">{formattedLabel}</p>
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center gap-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">
                {getMetricLabel(entry.dataKey)}:
              </span>
              <span className="text-xs font-medium text-foreground">
                {entry.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
