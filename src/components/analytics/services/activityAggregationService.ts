
import type { AnalyticsEventRow } from '@/utils/analytics';
import type { TimeRange } from '../types/analytics';
import { formatEventDateKey } from './utils/dateFormattingUtils';
import { validateInputEvents, validateDataIntegrity } from './utils/dataValidationUtils';
import { 
  processEventByType, 
  validateProcessedKey, 
  logEventProcessing,
  type ActivityStats 
} from './utils/eventProcessingUtils';
import { StatisticsTracker } from './utils/statisticsTracker';
import { validateFinalResult } from './utils/resultValidationUtils';

export const generateTimezoneAwareActivity = (events: AnalyticsEventRow[], timeRange: TimeRange, timezone: string) => {
  console.log('=== ACTIVITY AGGREGATION START ===');
  console.log('Processing:', { eventCount: events.length, timeRange, timezone });
  
  const validation = validateInputEvents(events);
  if (!validation.isValid) {
    return [];
  }
  
  const activityStats: Record<string, ActivityStats> = {};
  const statsTracker = new StatisticsTracker();
  
  // Process each event with enhanced debugging
  events.forEach((event, index) => {
    try {
      // Validate input date
      const eventDate = new Date(event.created_at);
      if (isNaN(eventDate.getTime())) {
        console.error(`CRITICAL: Invalid date at index ${index}:`, event.created_at);
        statsTracker.incrementError();
        return;
      }
      
      const isMayJune = event.created_at.startsWith('2025-05') || event.created_at.startsWith('2025-06');
      
      let key: string;
      let processedMonth: string;
      
      try {
        key = formatEventDateKey(eventDate, timeRange, timezone);
        processedMonth = key.substring(0, 7);
        
        logEventProcessing(event, key, index, isMayJune);
        
        // Track May/June processing
        if (event.created_at.startsWith('2025-05')) statsTracker.incrementMayProcessed();
        if (event.created_at.startsWith('2025-06')) statsTracker.incrementJuneProcessed();
        
      } catch (formatError) {
        console.error(`Date formatting error at index ${index}:`, formatError);
        statsTracker.incrementError();
        return;
      }
      
      // Validate generated key
      if (!validateProcessedKey(key, event.created_at, index)) {
        statsTracker.incrementError();
        return;
      }
      
      // Track month distribution in output
      statsTracker.trackMonth(processedMonth);
      
      // Initialize stats for this key if needed
      if (!activityStats[key]) {
        activityStats[key] = { views: 0, sessions: new Set(), prompts: 0, chats: 0 };
      }
      
      // Process event by type
      processEventByType(event, activityStats[key]);
      
      statsTracker.incrementProcessed();
      
    } catch (error) {
      console.error(`Unexpected error processing event ${index}:`, {
        error: error.message,
        event_date: event.created_at,
        event_type: event.event_type
      });
      statsTracker.incrementError();
    }
  });
  
  const summary = statsTracker.getSummary();
  statsTracker.logSummary();
  console.log(`Generated ${Object.keys(activityStats).length} unique time periods`);
  
  // Validate data integrity
  validateDataIntegrity(
    validation.monthTracker,
    summary.outputMonthTracker,
    summary.mayProcessedCount,
    summary.juneProcessedCount
  );
  
  // Convert to final result format
  const result = Object.entries(activityStats)
    .map(([dateKey, stats]) => ({
      date: dateKey,
      views: stats.views,
      sessions: stats.sessions.size,
      prompts: stats.prompts,
      chats: stats.chats
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  validateFinalResult(result);
  
  console.log('=== ACTIVITY AGGREGATION END ===');
  return result;
};
