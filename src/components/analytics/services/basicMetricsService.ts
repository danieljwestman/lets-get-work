
import type { AnalyticsEventRow } from '@/utils/analytics';

export const aggregateBasicMetrics = (events: AnalyticsEventRow[]) => {
  const totalViews = events.filter(e => e.event_type === 'page_view').length;
  const uniqueSessions = new Set(events.map(e => e.session_id)).size;
  const chatStarts = events.filter(e => e.event_type === 'chat_started').length;
  const chatPrompts = events.filter(e => e.event_type === 'chat_prompt').length;
  const emailsSent = events.filter(e => e.event_type === 'email_sent').length;
  const buttonClicks = events.filter(e => e.event_type === 'button_click').length;
  const sectionViews = events.filter(e => e.event_type === 'section_view').length;

  return {
    totalViews,
    uniqueSessions,
    chatStarts,
    chatPrompts,
    emailsSent,
    buttonClicks,
    sectionViews
  };
};

export const aggregateExternalLinkClicks = (events: AnalyticsEventRow[]) => {
  const githubClicks = events.filter(e => 
    e.event_type === 'external_link_click' && 
    e.event_data?.platform === 'github'
  ).length;

  const linkedinClicks = events.filter(e => 
    e.event_type === 'external_link_click' && 
    e.event_data?.platform === 'linkedin'
  ).length;

  return { githubClicks, linkedinClicks };
};

export const aggregateDeviceMetrics = (events: AnalyticsEventRow[]) => {
  const mobileVisitors = events.filter(e => 
    e.event_type === 'page_view' && 
    e.event_data?.device_type === 'mobile'
  ).length;

  const desktopVisitors = events.filter(e => 
    e.event_type === 'page_view' && 
    e.event_data?.device_type === 'desktop'
  ).length;

  return { mobileVisitors, desktopVisitors };
};

export const aggregateLanguageMetrics = (events: AnalyticsEventRow[]) => {
  const englishVisitors = events.filter(e => 
    e.event_type === 'page_view' && 
    (e.event_data?.language === 'en' || !e.event_data?.language)
  ).length;

  const swedishVisitors = events.filter(e => 
    e.event_type === 'page_view' && 
    e.event_data?.language === 'sv'
  ).length;

  return { englishVisitors, swedishVisitors };
};
