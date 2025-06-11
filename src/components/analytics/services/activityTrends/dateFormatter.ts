
import type { TimeRange } from '../../types/analytics';
import { format } from 'date-fns';

export const formatChartDate = (dateStr: string, timeRange: TimeRange): string => {
  try {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    
    // Check if the dateStr includes time information (has colons)
    const hasTimeInfo = dateStr.includes(':');
    
    if (hasTimeInfo) {
      // For minute/hour granularity data
      if (dateStr.includes(':', dateStr.lastIndexOf(':'))) {
        // Minute granularity (yyyy-MM-dd HH:mm format)
        return format(date, 'HH:mm');
      } else {
        // Hour granularity (yyyy-MM-dd HH:00 format)
        return format(date, 'HH:mm');
      }
    }
    
    // For daily granularity, use existing logic
    switch (timeRange) {
      case '1h':
      case '1d':
        return format(date, 'HH:mm');
      case '30d':
        return format(date, 'MM/dd');
      case '1y':
      case 'all':
        return format(date, 'MMM dd');
      default:
        return format(date, 'MM/dd');
    }
  } catch (error) {
    console.error('Error formatting chart date:', error);
    return dateStr;
  }
};
