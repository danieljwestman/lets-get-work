
interface DailyActivityItem {
  date: string;
  views: number;
  sessions: number;
  prompts: number;
  chats: number;
}

interface MonthTracker {
  [month: string]: number;
}

export const validateFinalResult = (result: DailyActivityItem[]): void => {
  console.log('=== FINAL RESULT VALIDATION ===');
  console.log(`Final result: ${result.length} data points`);
  
  if (result.length > 0) {
    console.log('Result date range:', {
      first: result[0].date,
      last: result[result.length - 1].date
    });
    
    // Critical validation of May/June in final result
    const resultMayData = result.filter(item => item.date.startsWith('2025-05'));
    const resultJuneData = result.filter(item => item.date.startsWith('2025-06'));
    
    console.log(`FINAL MAY 2025 DATA POINTS: ${resultMayData.length}`);
    console.log(`FINAL JUNE 2025 DATA POINTS: ${resultJuneData.length}`);
    
    if (resultMayData.length > 0) {
      console.log('May result sample:', resultMayData.slice(0, 3));
    } else {
      console.error('CRITICAL: NO MAY 2025 DATA IN FINAL RESULT!');
    }
    
    if (resultJuneData.length > 0) {
      console.log('June result sample:', resultJuneData.slice(0, 3));
    } else {
      console.error('CRITICAL: NO JUNE 2025 DATA IN FINAL RESULT!');
    }
    
    // Final month validation
    const resultMonthTracker: MonthTracker = {};
    result.forEach(item => {
      const month = item.date.substring(0, 7);
      resultMonthTracker[month] = (resultMonthTracker[month] || 0) + 1;
    });
    console.log('Final result by month:', resultMonthTracker);
    
  } else {
    console.error('CRITICAL: No result data generated despite having input events!');
  }
};
