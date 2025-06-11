
import { toZonedTime, format } from 'date-fns-tz';
import type { TimeRange } from '../../types/analytics';
import { getAggregationInterval } from '../../utils/timezoneUtils';

// Helper function to format date using native JS for UTC processing
export const formatDateUTC = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatEventDateKey = (
  eventDate: Date, 
  timeRange: TimeRange, 
  timezone: string
): string => {
  const interval = getAggregationInterval(timeRange);

  if (timeRange === 'all' || timeRange === '1y') {
    return formatDateUTC(eventDate);
  }

  // For shorter time ranges, use timezone conversion
  const zonedDate = toZonedTime(eventDate, timezone);
  if (isNaN(zonedDate.getTime())) {
    throw new Error('Invalid zoned date');
  }

  switch (interval) {
    case 'minute':
      const minutes = Math.floor(zonedDate.getMinutes() / 5) * 5;
      const roundedDate = new Date(zonedDate);
      roundedDate.setMinutes(minutes, 0, 0);
      return format(roundedDate, 'yyyy-MM-dd HH:mm', { timeZone: timezone });
    case 'hour':
      return format(zonedDate, 'yyyy-MM-dd HH:00', { timeZone: timezone });
    case 'day':
    default:
      return format(zonedDate, 'yyyy-MM-dd', { timeZone: timezone });
  }
};
