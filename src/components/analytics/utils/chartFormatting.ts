import type { TimeRange } from '../types/analytics';
import { formatDateInTimezone, formatTooltipDateInTimezone } from './timezoneUtils';

export const formatChartDate = (dateStr: string, timeRange: TimeRange, timezone: string = 'UTC'): string => {
  return formatDateInTimezone(dateStr, timeRange, timezone);
};

export const calculateOptimalTicks = (dataLength: number, timeRange: TimeRange): number => {
  // Base tick count on time range and data density
  switch (timeRange) {
    case '1h':
      return Math.min(6, Math.max(3, Math.floor(dataLength / 4)));
    case '1d':
      return Math.min(8, Math.max(4, Math.floor(dataLength / 3)));
    case '30d':
      return Math.min(10, Math.max(5, Math.floor(dataLength / 6)));
    case '1y':
      return Math.min(12, Math.max(6, Math.floor(dataLength / 4)));
    case 'all':
      return Math.min(8, Math.max(4, Math.floor(dataLength / 8)));
    default:
      return 6;
  }
};

export const getTickInterval = (dataLength: number, timeRange: TimeRange): number => {
  const optimalTicks = calculateOptimalTicks(dataLength, timeRange);
  return Math.max(0, Math.floor(dataLength / optimalTicks) - 1);
};

export const formatTooltipDate = (dateStr: string, timeRange: TimeRange, timezone: string = 'UTC'): string => {
  return formatTooltipDateInTimezone(dateStr, timeRange, timezone);
};
