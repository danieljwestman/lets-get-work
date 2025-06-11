
import type { AnalyticsEventRow } from '@/utils/analytics';
import type { ActivityTrendsData, DailyActivityData } from './types';
import { format, startOfHour, startOfDay, eachMinuteOfInterval, eachHourOfInterval, subHours, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { formatChartDate } from '../../utils/chartFormatting';
import type { TimeRange } from '../../types/analytics';

export const processEventsToActivityData = (events: AnalyticsEventRow[], timezone: string = 'UTC'): (ActivityTrendsData & { formattedDate: string; originalDate: string })[] => {
  console.log('Processing activity trends for', events.length, 'events with timezone:', timezone);
  
  if (events.length === 0) {
    return [];
  }

  // Get current time in the specified timezone
  const currentTimeUTC = new Date();
  const currentTimeInTimezone = toZonedTime(currentTimeUTC, timezone);

  // Determine the time range based on the data span
  const eventDates = events.map(e => new Date(e.created_at)).sort((a, b) => a.getTime() - b.getTime());
  const firstEventDate = eventDates[0];
  const lastEventDate = eventDates[eventDates.length - 1];
  const timeSpan = lastEventDate.getTime() - firstEventDate.getTime();
  
  // Use actual last event time, not current time, to prevent future data points
  const endTime = lastEventDate < currentTimeUTC ? lastEventDate : currentTimeUTC;
  
  // If data spans less than 2 hours, use minute granularity
  // If data spans less than 2 days, use hourly granularity
  // Otherwise use daily granularity
  const useMinuteGranularity = timeSpan <= 2 * 60 * 60 * 1000; // 2 hours
  const useHourlyGranularity = timeSpan <= 2 * 24 * 60 * 60 * 1000; // 2 days

  let timeIntervals: Date[] = [];
  let formatString: string;
  let timeRange: TimeRange;

  if (useMinuteGranularity) {
    // Create minute intervals only for the actual data range
    const startTime = firstEventDate;
    timeIntervals = eachMinuteOfInterval({ start: startTime, end: endTime });
    formatString = 'yyyy-MM-dd HH:mm';
    timeRange = '1h';
    console.log('Using minute granularity from', startTime.toISOString(), 'to', endTime.toISOString());
  } else if (useHourlyGranularity) {
    // Create hourly intervals only for the actual data range
    const startTime = startOfDay(firstEventDate);
    timeIntervals = eachHourOfInterval({ start: startTime, end: endTime });
    formatString = 'yyyy-MM-dd HH:00';
    timeRange = '1d';
    console.log('Using hourly granularity from', startTime.toISOString(), 'to', endTime.toISOString());
  } else {
    // Use daily granularity for longer periods
    formatString = 'yyyy-MM-dd';
    timeRange = '30d';
    console.log('Using daily granularity');
  }

  // Group events by appropriate time key
  const dataByTime: Record<string, DailyActivityData> = {};

  if (useMinuteGranularity || useHourlyGranularity) {
    // Initialize all time intervals with zero data (only for actual data timespan)
    timeIntervals.forEach(interval => {
      const timeKey = format(interval, formatString);
      dataByTime[timeKey] = {
        views: 0,
        sessions: new Set(),
        chatStarts: 0,
        chatPrompts: 0,
        buttonClicks: 0
      };
    });
  }

  // Process all events
  events.forEach((event) => {
    const eventDate = new Date(event.created_at);
    
    if (isNaN(eventDate.getTime())) {
      return; // Skip invalid dates
    }
    
    // Skip events that are in the future (shouldn't happen but safety check)
    if (eventDate > currentTimeUTC) {
      console.warn('Skipping future event:', event.created_at);
      return;
    }
    
    let timeKey: string;
    
    if (useMinuteGranularity) {
      // Round down to the nearest minute
      const roundedDate = new Date(eventDate);
      roundedDate.setSeconds(0, 0);
      timeKey = format(roundedDate, formatString);
    } else if (useHourlyGranularity) {
      // Round down to the nearest hour
      timeKey = format(startOfHour(eventDate), formatString);
    } else {
      // Use daily granularity
      timeKey = format(eventDate, formatString);
    }
    
    if (!dataByTime[timeKey]) {
      dataByTime[timeKey] = {
        views: 0,
        sessions: new Set(),
        chatStarts: 0,
        chatPrompts: 0,
        buttonClicks: 0
      };
    }

    const timeData = dataByTime[timeKey];
    
    // Track sessions for uniqueness
    timeData.sessions.add(event.session_id);
    
    // Count events by type
    switch (event.event_type) {
      case 'page_view':
        timeData.views++;
        break;
      case 'chat_started':
        timeData.chatStarts++;
        break;
      case 'chat_prompt':
        timeData.chatPrompts++;
        break;
      case 'button_click':
        timeData.buttonClicks++;
        break;
    }
  });

  // Convert to chart format and filter out any future time points
  const result = Object.keys(dataByTime)
    .sort()
    .map(timeKey => ({
      date: timeKey,
      originalDate: timeKey,
      formattedDate: formatChartDate(timeKey, timeRange, timezone),
      totalViews: dataByTime[timeKey].views,
      uniqueSessions: dataByTime[timeKey].sessions.size,
      chatInteractions: dataByTime[timeKey].chatStarts + dataByTime[timeKey].chatPrompts,
      buttonClicks: dataByTime[timeKey].buttonClicks
    }))
    .filter(item => {
      // Additional safety check to ensure no future data points
      const itemDate = new Date(item.date);
      return itemDate <= currentTimeUTC;
    });

  console.log(`Generated ${result.length} activity data points with ${useMinuteGranularity ? 'minute' : useHourlyGranularity ? 'hourly' : 'daily'} granularity`);
  console.log('Time range:', result.length > 0 ? `${result[0].date} to ${result[result.length - 1].date}` : 'no data');
  
  return result;
};
