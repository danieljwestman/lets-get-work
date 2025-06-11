
import type { AnalyticsEventRow } from '@/utils/analytics';

export const generateDeviceBreakdown = (events: AnalyticsEventRow[]) => {
  const deviceCounts = events.reduce((acc: Record<string, number>, event) => {
    if (event.event_type === 'page_view' && event.event_data?.device_type) {
      const deviceType = String(event.event_data.device_type).toLowerCase();
      if (deviceType.match(/^[a-z]+$/)) {
        acc[deviceType] = (acc[deviceType] || 0) + 1;
      }
    }
    return acc;
  }, {});

  const totalDeviceViews = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
  return Object.entries(deviceCounts).map(([device_type, count]) => ({
    device_type: device_type.charAt(0).toUpperCase() + device_type.slice(1),
    count,
    percentage: totalDeviceViews > 0 ? Math.round((count / totalDeviceViews) * 100) : 0
  }));
};

export const generateLanguageBreakdown = (events: AnalyticsEventRow[]) => {
  const languageCounts = events.reduce((acc: Record<string, number>, event) => {
    if (event.event_type === 'page_view') {
      const language = String(event.event_data?.language || 'en').toLowerCase();
      if (language.match(/^[a-z]{2}$/)) {
        acc[language] = (acc[language] || 0) + 1;
      }
    }
    return acc;
  }, {});

  const totalLanguageViews = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);
  return Object.entries(languageCounts).map(([language, count]) => ({
    language: language === 'en' ? 'English' : language === 'sv' ? 'Swedish' : language,
    count,
    percentage: totalLanguageViews > 0 ? Math.round((count / totalLanguageViews) * 100) : 0
  }));
};
