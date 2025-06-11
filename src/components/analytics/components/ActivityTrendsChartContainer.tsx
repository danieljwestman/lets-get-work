
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { getTickInterval, getChartMargins, getLineConfig, getLineColors } from './chartUtils';
import type { ActivityTrendsData } from '../services/activityTrends';
import type { TimeRange } from '../types/analytics';

interface ActivityTrendsChartContainerProps {
  data: (ActivityTrendsData & { formattedDate: string; originalDate: string })[];
  timeRange: TimeRange;
  timezone: string;
}

export const ActivityTrendsChartContainer: React.FC<ActivityTrendsChartContainerProps> = ({ 
  data, 
  timeRange, 
  timezone 
}) => {
  const tickInterval = getTickInterval(data.length);
  const margins = getChartMargins();
  const lineConfig = getLineConfig();
  const colors = getLineColors();

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={margins}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="formattedDate"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            interval={tickInterval}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip 
            content={<CustomTooltip timeRange={timeRange} timezone={timezone} />}
          />
          
          {/* Blue: Total Views */}
          <Line 
            type="monotone" 
            dataKey="totalViews" 
            stroke={colors.totalViews}
            {...lineConfig}
            dot={{ ...lineConfig.dot, fill: colors.totalViews }}
            activeDot={{ ...lineConfig.activeDot, fill: colors.totalViews }}
          />
          
          {/* Green: Unique Sessions */}
          <Line 
            type="monotone" 
            dataKey="uniqueSessions" 
            stroke={colors.uniqueSessions}
            {...lineConfig}
            dot={{ ...lineConfig.dot, fill: colors.uniqueSessions }}
            activeDot={{ ...lineConfig.activeDot, fill: colors.uniqueSessions }}
          />
          
          {/* Purple: Chat Interactions */}
          <Line 
            type="monotone" 
            dataKey="chatInteractions" 
            stroke={colors.chatInteractions}
            {...lineConfig}
            dot={{ ...lineConfig.dot, fill: colors.chatInteractions }}
            activeDot={{ ...lineConfig.activeDot, fill: colors.chatInteractions }}
          />
          
          {/* Orange: Button Clicks */}
          <Line 
            type="monotone" 
            dataKey="buttonClicks" 
            stroke={colors.buttonClicks}
            {...lineConfig}
            dot={{ ...lineConfig.dot, fill: colors.buttonClicks }}
            activeDot={{ ...lineConfig.activeDot, fill: colors.buttonClicks }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
