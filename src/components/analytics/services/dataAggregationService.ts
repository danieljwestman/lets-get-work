
import type { AnalyticsEventRow } from '@/utils/analytics';
import type { AnalyticsData, TimeRange } from '../types/analytics';
import { 
  aggregateBasicMetrics, 
  aggregateExternalLinkClicks, 
  aggregateDeviceMetrics, 
  aggregateLanguageMetrics 
} from './basicMetricsService';
import { aggregateTopEvents } from './eventAggregationService';
import { generateDeviceBreakdown, generateLanguageBreakdown } from './breakdownAggregationService';
import { generateTimezoneAwareActivity } from './activityAggregationService';

export const dataAggregationService = {
  aggregateAnalyticsData: (events: AnalyticsEventRow[], timeRange: TimeRange, timezone: string = 'UTC'): AnalyticsData => {
    console.log('=== DATA AGGREGATION SERVICE START ===');
    console.log('dataAggregationService: Processing', events.length, 'events');
    console.log('dataAggregationService: TimeRange:', timeRange, 'Timezone:', timezone);
    
    if (events.length === 0) {
      console.log('dataAggregationService: No events to process, returning empty data');
      return {
        totalViews: 0,
        uniqueSessions: 0,
        chatStarts: 0,
        chatPrompts: 0,
        githubClicks: 0,
        linkedinClicks: 0,
        emailsSent: 0,
        buttonClicks: 0,
        sectionViews: 0,
        mobileVisitors: 0,
        desktopVisitors: 0,
        englishVisitors: 0,
        swedishVisitors: 0,
        topEvents: [],
        dailyActivity: [],
        deviceBreakdown: [],
        languageBreakdown: [],
        companies: []
      };
    }
    
    // Add debugging for input events
    const eventDates = events.map(e => e.created_at).sort();
    console.log('dataAggregationService: Input events span from', eventDates[0], 'to', eventDates[eventDates.length - 1]);
    
    // Show event type distribution
    const eventTypes = events.reduce((acc, e) => {
      acc[e.event_type] = (acc[e.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('dataAggregationService: Event type distribution:', eventTypes);
    
    // Show opportunity distribution
    const oppDistribution = events.reduce((acc, e) => {
      acc[e.opportunity_id] = (acc[e.opportunity_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('dataAggregationService: Opportunity distribution:', oppDistribution);
    
    console.log('dataAggregationService: Starting individual aggregations...');
    
    const basicMetrics = aggregateBasicMetrics(events);
    console.log('dataAggregationService: Basic metrics completed:', basicMetrics);
    
    const externalLinks = aggregateExternalLinkClicks(events);
    console.log('dataAggregationService: External links completed:', externalLinks);
    
    const deviceMetrics = aggregateDeviceMetrics(events);
    console.log('dataAggregationService: Device metrics completed:', deviceMetrics);
    
    const languageMetrics = aggregateLanguageMetrics(events);
    console.log('dataAggregationService: Language metrics completed:', languageMetrics);
    
    const topEvents = aggregateTopEvents(events);
    console.log('dataAggregationService: Top events completed:', topEvents.length, 'events');
    
    console.log('dataAggregationService: Starting daily activity generation...');
    const dailyActivity = generateTimezoneAwareActivity(events, timeRange, timezone);
    console.log('dataAggregationService: Daily activity completed:', dailyActivity.length, 'data points');
    
    const deviceBreakdown = generateDeviceBreakdown(events);
    console.log('dataAggregationService: Device breakdown completed:', deviceBreakdown.length, 'items');
    
    const languageBreakdown = generateLanguageBreakdown(events);
    console.log('dataAggregationService: Language breakdown completed:', languageBreakdown.length, 'items');

    const result = {
      totalViews: basicMetrics.totalViews,
      uniqueSessions: basicMetrics.uniqueSessions,
      chatStarts: basicMetrics.chatStarts,
      chatPrompts: basicMetrics.chatPrompts,
      githubClicks: externalLinks.githubClicks,
      linkedinClicks: externalLinks.linkedinClicks,
      emailsSent: basicMetrics.emailsSent,
      buttonClicks: basicMetrics.buttonClicks,
      sectionViews: basicMetrics.sectionViews,
      mobileVisitors: deviceMetrics.mobileVisitors,
      desktopVisitors: deviceMetrics.desktopVisitors,
      englishVisitors: languageMetrics.englishVisitors,
      swedishVisitors: languageMetrics.swedishVisitors,
      topEvents,
      dailyActivity,
      deviceBreakdown,
      languageBreakdown,
      companies: [] // Empty for now as this would come from opportunity data
    };

    console.log('dataAggregationService: Final result summary:');
    console.log('  Total views:', result.totalViews);
    console.log('  Daily activity data points:', result.dailyActivity.length);
    if (result.dailyActivity.length > 0) {
      console.log('  Daily activity date range:', result.dailyActivity[0].date, 'to', result.dailyActivity[result.dailyActivity.length - 1].date);
    }
    console.log('=== DATA AGGREGATION SERVICE END ===');
    
    return result;
  }
};
