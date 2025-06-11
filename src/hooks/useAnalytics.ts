
import { useEffect, useRef, useCallback } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { analytics } from '@/utils/analytics';

export const useAnalytics = () => {
  const { opportunity, isLoading: opportunityLoading } = useOpportunity();
  const { language } = useLanguage();
  const hasTrackedPageView = useRef(false);
  const opportunityDataSetRef = useRef(false);
  const lastOpportunityId = useRef<string | null>(null);

  // Single consolidated useEffect for all analytics setup
  useEffect(() => {
    // Reset tracking when opportunity changes
    if (opportunity?.opportunity_id !== lastOpportunityId.current) {
      hasTrackedPageView.current = false;
      opportunityDataSetRef.current = false;
      lastOpportunityId.current = opportunity?.opportunity_id || null;
    }

    // Set the opportunity data when it changes and opportunity is not loading
    if (opportunity && !opportunityLoading && !opportunityDataSetRef.current) {
      console.log('useAnalytics: Setting opportunity data - opportunityId:', opportunity.opportunity_id, 'themeId:', opportunity.theme_id);
      analytics.setOpportunityData(opportunity.opportunity_id, opportunity.theme_id);
      opportunityDataSetRef.current = true;
    }

    // Set the language when it changes
    console.log('useAnalytics: Setting language to:', language);
    analytics.setLanguage(language);
  }, [opportunity?.opportunity_id, opportunity?.theme_id, opportunityLoading, language]);

  const trackPageView = useCallback((additionalData?: Record<string, any>) => {
    // Check if analytics is ready (opportunity data is set) and opportunity is not loading
    if (!analytics.isReady() || opportunityLoading) {
      console.log('useAnalytics: Analytics not ready yet or opportunity loading - ready:', analytics.isReady(), 'opportunity loading:', opportunityLoading);
      return;
    }

    // Prevent duplicate page view tracking on the same page load
    if (hasTrackedPageView.current) {
      console.log('useAnalytics: Page view already tracked, skipping');
      return;
    }
    
    hasTrackedPageView.current = true;
    console.log('useAnalytics: Tracking page view with opportunity:', opportunity?.opportunity_id, 'theme:', opportunity?.theme_id);
    analytics.trackPageView(additionalData);
  }, [opportunity?.opportunity_id, opportunity?.theme_id, opportunityLoading]);

  // Wrapper functions that check if analytics is ready and add security logging
  const trackSectionView = useCallback((sectionId: string) => {
    if (!analytics.isReady()) {
      console.log('useAnalytics: Analytics not ready, skipping section view tracking');
      return;
    }
    console.log('useAnalytics: Tracking section view:', sectionId);
    analytics.trackSectionView(sectionId);
  }, []);

  const trackButtonClick = useCallback((buttonName: string, context?: string) => {
    if (!analytics.isReady()) {
      console.log('useAnalytics: Analytics not ready, skipping button click tracking');
      return;
    }
    console.log('useAnalytics: Tracking button click:', buttonName, 'context:', context);
    analytics.trackButtonClick(buttonName, context);
  }, []);

  const trackChatInteraction = useCallback((action: string, data?: Record<string, any>) => {
    if (!analytics.isReady()) {
      console.log('useAnalytics: Analytics not ready, skipping chat interaction tracking');
      return;
    }
    console.log('useAnalytics: Tracking chat interaction:', action);
    analytics.trackChatInteraction(action, data);
  }, []);

  const trackChatPrompt = useCallback((promptLength: number, promptPreview?: string) => {
    if (!analytics.isReady()) {
      console.log('useAnalytics: Analytics not ready, skipping chat prompt tracking');
      return;
    }
    console.log('useAnalytics: Tracking chat prompt, length:', promptLength);
    analytics.trackChatPrompt(promptLength, promptPreview);
  }, []);

  const trackEmailSent = useCallback((inquiryType: string) => {
    if (!analytics.isReady()) {
      console.log('useAnalytics: Analytics not ready, skipping email sent tracking');
      return;
    }
    console.log('useAnalytics: Tracking email sent:', inquiryType);
    analytics.trackEmailSent(inquiryType);
  }, []);

  const trackDownload = useCallback((fileName: string) => {
    if (!analytics.isReady()) {
      console.log('useAnalytics: Analytics not ready, skipping download tracking');
      return;
    }
    console.log('useAnalytics: Tracking download:', fileName);
    analytics.trackDownload(fileName);
  }, []);

  const trackChatStart = useCallback((source: 'hero' | 'contact' | 'floating_button') => {
    if (!analytics.isReady()) {
      console.log('useAnalytics: Analytics not ready, skipping chat start tracking');
      return;
    }
    console.log('useAnalytics: Tracking chat start from:', source);
    analytics.trackChatStart(source);
  }, []);

  const trackExternalLink = useCallback((platform: 'github' | 'linkedin', context?: string) => {
    if (!analytics.isReady()) {
      console.log('useAnalytics: Analytics not ready, skipping external link tracking');
      return;
    }
    console.log('useAnalytics: Tracking external link click:', platform, 'context:', context);
    analytics.trackExternalLink(platform, context);
  }, []);

  return {
    trackPageView,
    trackSectionView,
    trackButtonClick,
    trackChatInteraction,
    trackChatPrompt,
    trackEmailSent,
    trackDownload,
    trackChatStart,
    trackExternalLink,
    isReady: analytics.isReady,
  };
};
