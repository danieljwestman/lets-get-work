
import type { AnalyticsEventRow } from '@/utils/analytics';

interface MonthTracker {
  [month: string]: number;
}

export const validateInputEvents = (events: AnalyticsEventRow[]) => {
  console.log('=== INPUT VALIDATION START ===');
  console.log('Processing:', { eventCount: events.length });
  
  if (events.length === 0) {
    console.log('No events provided, returning empty array');
    return { isValid: false, monthTracker: {} };
  }
  
  const inputMonthTracker: MonthTracker = {};
  const eventDates = events.map(e => e.created_at).sort();
  console.log('Input event date range:', {
    earliest: eventDates[0],
    latest: eventDates[eventDates.length - 1],
    totalEvents: events.length
  });
  
  // Track May and June specifically
  const mayEvents = events.filter(e => e.created_at.startsWith('2025-05'));
  const juneEvents = events.filter(e => e.created_at.startsWith('2025-06'));
  console.log('CRITICAL INPUT CHECK:');
  console.log('  May 2025 events:', mayEvents.length);
  console.log('  June 2025 events:', juneEvents.length);
  
  if (mayEvents.length > 0) {
    console.log('  May sample events:', mayEvents.slice(0, 3).map(e => ({ date: e.created_at, type: e.event_type })));
  }
  if (juneEvents.length > 0) {
    console.log('  June sample events:', juneEvents.slice(0, 3).map(e => ({ date: e.created_at, type: e.event_type })));
  }
  
  events.forEach(event => {
    const month = event.created_at.substring(0, 7); // YYYY-MM
    inputMonthTracker[month] = (inputMonthTracker[month] || 0) + 1;
  });
  console.log('Input events by month:', inputMonthTracker);
  
  return { isValid: true, monthTracker: inputMonthTracker };
};

export const validateDataIntegrity = (
  inputMonthTracker: MonthTracker,
  outputMonthTracker: MonthTracker,
  mayProcessedCount: number,
  juneProcessedCount: number
) => {
  console.log('=== DATA INTEGRITY VALIDATION ===');
  
  const inputTotal = Object.values(inputMonthTracker).reduce((sum, count) => sum + count, 0);
  const outputTotal = Object.values(outputMonthTracker).reduce((sum, count) => sum + count, 0);
  
  if (inputTotal !== outputTotal) {
    console.error('CRITICAL DATA LOSS DETECTED!', {
      inputTotal,
      outputTotal,
      lostEvents: inputTotal - outputTotal,
      inputMonths: Object.keys(inputMonthTracker).sort(),
      outputMonths: Object.keys(outputMonthTracker).sort()
    });
  } else {
    console.log('✅ Data integrity verified: All events processed successfully');
  }
  
  // Check for May/June data integrity
  const inputMay = inputMonthTracker['2025-05'] || 0;
  const inputJune = inputMonthTracker['2025-06'] || 0;
  const outputMay = outputMonthTracker['2025-05'] || 0;
  const outputJune = outputMonthTracker['2025-06'] || 0;
  
  console.log('MAY DATA INTEGRITY:');
  console.log(`  Input: ${inputMay} events, Output: ${outputMay} events`);
  if (inputMay !== outputMay) {
    console.error('  CRITICAL: MAY DATA LOST!');
  } else {
    console.log('  ✅ May data preserved');
  }
  
  console.log('JUNE DATA INTEGRITY:');
  console.log(`  Input: ${inputJune} events, Output: ${outputJune} events`);
  if (inputJune !== outputJune) {
    console.error('  CRITICAL: JUNE DATA LOST!');
  } else {
    console.log('  ✅ June data preserved');
  }
  
  console.log(`MAY 2025: ${mayProcessedCount} events processed`);
  console.log(`JUNE 2025: ${juneProcessedCount} events processed`);
};
