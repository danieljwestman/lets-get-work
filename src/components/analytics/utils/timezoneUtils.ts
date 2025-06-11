import { format, toZonedTime, fromZonedTime } from 'date-fns-tz';
import type { TimeRange } from '../types/analytics';

export interface TimezoneOption {
  value: string;
  label: string;
  abbreviation: string;
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: 'Europe/Stockholm', label: 'Sweden', abbreviation: 'CET/CEST' },
  { value: 'UTC', label: 'UTC', abbreviation: 'UTC' },
  { value: 'America/New_York', label: 'US Eastern', abbreviation: 'EST/EDT' },
  { value: 'America/Los_Angeles', label: 'US Pacific', abbreviation: 'PST/PDT' },
  { value: 'Europe/London', label: 'UK', abbreviation: 'GMT/BST' },
  { value: 'Asia/Tokyo', label: 'Japan', abbreviation: 'JST' }
];

export const getTimezoneAwareDateFilter = (timeRange: TimeRange, timezone: string): string | null => {
  console.log('=== TIMEZONE DATE FILTER START ===');
  console.log('Input:', { timeRange, timezone });
  
  // CRITICAL FIX: For "all" and "1y" time range, never apply date filters - we want ALL available data
  if (timeRange === 'all' || timeRange === '1y') {
    console.log('ALL/1Y TIME: No date filter needed, returning null to get all data');
    console.log('=== TIMEZONE DATE FILTER END ===');
    return null;
  }
  
  try {
    const now = new Date();
    console.log('Current UTC time:', now.toISOString());
    
    const zonedNow = toZonedTime(now, timezone);
    console.log('Current time in timezone:', zonedNow.toISOString());
    
    const startDate = new Date(zonedNow);
    
    switch (timeRange) {
      case '1h':
        startDate.setHours(zonedNow.getHours() - 1);
        break;
      case '1d':
        startDate.setHours(zonedNow.getHours() - 24);
        break;
      case '30d':
        startDate.setDate(zonedNow.getDate() - 30);
        break;
      default:
        console.log('Unknown timeRange, returning null');
        return null;
    }
    
    console.log('Start date in timezone:', startDate.toISOString());
    
    // Convert back to UTC for database query
    const utcStartDate = fromZonedTime(startDate, timezone);
    const result = utcStartDate.toISOString();
    
    console.log('Final UTC filter date:', result);
    console.log('=== TIMEZONE DATE FILTER END ===');
    return result;
    
  } catch (error) {
    console.error('Error in timezone date filter:', error);
    console.log('=== TIMEZONE DATE FILTER END ===');
    return null;
  }
};

export const formatDateInTimezone = (dateStr: string, timeRange: TimeRange, timezone: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('Invalid date for formatting:', dateStr);
      return dateStr;
    }
    
    // Use human-friendly formats for all time ranges
    if (timeRange === 'all' || timeRange === '1y') {
      switch (timeRange) {
        case '1y':
          return format(date, 'MMM yyyy'); // "Jan 2024"
        case 'all':
          return format(date, 'MMM dd'); // "Jun 07"
        default:
          return format(date, 'MMM dd');
      }
    }
    
    const zonedDate = toZonedTime(date, timezone);
    
    switch (timeRange) {
      case '1h':
        return format(zonedDate, 'HH:mm', { timeZone: timezone });
      case '1d':
        return format(zonedDate, 'HH:mm', { timeZone: timezone });
      case '30d':
        return format(zonedDate, 'MMM dd', { timeZone: timezone }); // "Jun 07"
      default:
        return format(zonedDate, 'MMM dd', { timeZone: timezone });
    }
  } catch (error) {
    console.error('Error formatting date:', error, 'dateStr:', dateStr);
    return dateStr;
  }
};

export const formatTooltipDateInTimezone = (dateStr: string, timeRange: TimeRange, timezone: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('Invalid date for tooltip formatting:', dateStr);
      return dateStr;
    }
    
    // For all time and 1y, use more human-friendly UTC formatting
    if (timeRange === 'all' || timeRange === '1y') {
      switch (timeRange) {
        case '1y':
          return format(date, 'MMMM yyyy'); // "January 2024"
        case 'all':
          return format(date, 'MMMM do, yyyy'); // "June 7th, 2024"
        default:
          return format(date, 'MMMM do, yyyy');
      }
    }
    
    const zonedDate = toZonedTime(date, timezone);
    
    switch (timeRange) {
      case '1h':
        return format(zonedDate, 'HH:mm:ss', { timeZone: timezone });
      case '1d':
        return format(zonedDate, 'MMMM do, HH:mm', { timeZone: timezone }); // "June 7th, 14:30"
      case '30d':
        return format(zonedDate, 'MMMM do, yyyy', { timeZone: timezone }); // "June 7th, 2024"
      default:
        return format(zonedDate, 'MMMM do, yyyy', { timeZone: timezone });
    }
  } catch (error) {
    console.error('Error formatting tooltip date:', error, 'dateStr:', dateStr);
    return dateStr;
  }
};

export const getAggregationInterval = (timeRange: TimeRange): 'minute' | 'hour' | 'day' => {
  switch (timeRange) {
    case '1h':
      return 'minute';
    case '1d':
      return 'hour';
    default:
      return 'day';
  }
};
