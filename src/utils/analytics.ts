
import { supabase } from '@/integrations/supabase/client';
import { plausible, plausibleGoals } from './plausible';

export interface AnalyticsEventRow {
  id: string;
  created_at: string;
  opportunity_id: string;
  event_type: string;
  event_data: any;
  user_agent: string;
  ip_address: unknown;
  session_id: string;
  page_url: string;
  referrer: string | null;
  theme_id: string | null;
  user_id: string | null;
}

export interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  page_url: string;
  referrer?: string;
  session_id: string;
  user_agent: string;
  opportunity_id: string;
  theme_id?: string;
  user_id?: string;
}

// Global session ID that persists across page loads
let sessionId: string | null = null;
let opportunityId: string | null = null;
let themeId: string | null = null;
let language: string = 'en';

export const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
  }
  return sessionId;
};

export const trackEvent = async (event: AnalyticsEvent) => {
  try {
    // The database triggers will now handle user_id resolution automatically
    // We don't need to resolve it manually anymore
    const analyticsData = {
      ...event,
      session_id: getSessionId(),
      created_at: new Date().toISOString(),
    };

    console.log('📊 Tracking analytics event:', {
      event_type: event.event_type,
      opportunity_id: event.opportunity_id,
      theme_id: event.theme_id,
    });

    const { error } = await supabase
      .from('analytics_events')
      .insert([analyticsData]);

    if (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw the error to avoid breaking the user experience
      // Analytics failures should be silent for end users
    } else {
      console.log('✅ Analytics event tracked successfully');
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error);
    // Analytics failures should not break the application
  }
};

// Analytics object for useAnalytics hook
export const analytics = {
  setOpportunityData: (oppId: string, thId: string) => {
    opportunityId = oppId;
    themeId = thId;
    console.log('Analytics: Set opportunity data -', { opportunityId: oppId, themeId: thId });
  },
  
  setLanguage: (lang: string) => {
    language = lang;
  },
  
  isReady: () => {
    return opportunityId !== null && themeId !== null;
  },

  trackPageView: (additionalData?: Record<string, any>) => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track page view - opportunity data not set');
      return;
    }
    
    const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
    
    // Track with Supabase
    trackEvent({
      event_type: 'page_view',
      event_data: { 
        device_type: deviceType,
        language: language,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        ...additionalData
      },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible
    plausible.trackEvent(plausibleGoals.PAGE_VIEW, {
      device_type: deviceType,
      language: language,
      opportunity_id: opportunityId
    });
  },

  trackSectionView: (sectionId: string) => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track section view - opportunity data not set');
      return;
    }
    
    // Track with Supabase
    trackEvent({
      event_type: 'section_view',
      event_data: { section_id: sectionId },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible
    plausible.trackEvent(plausibleGoals.SECTION_VIEW, {
      section: sectionId,
      opportunity_id: opportunityId
    });
  },

  trackButtonClick: (buttonName: string, context?: string) => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track button click - opportunity data not set');
      return;
    }
    
    // Track with Supabase
    trackEvent({
      event_type: 'button_click',
      event_data: { button_name: buttonName, context },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible
    plausible.trackEvent(plausibleGoals.BUTTON_CLICK, {
      button: buttonName,
      context: context || 'unknown',
      opportunity_id: opportunityId
    });
  },

  trackChatInteraction: (action: string, data?: Record<string, any>) => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track chat interaction - opportunity data not set');
      return;
    }
    
    // Track with Supabase
    trackEvent({
      event_type: 'chat_interaction',
      event_data: { action, ...data },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible based on action type
    if (action === 'started') {
      plausible.trackEvent(plausibleGoals.CHAT_STARTED, {
        opportunity_id: opportunityId
      });
    }
  },

  trackChatPrompt: (promptLength: number, promptPreview?: string) => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track chat prompt - opportunity data not set');
      return;
    }
    
    // Track with Supabase
    trackEvent({
      event_type: 'chat_prompt',
      event_data: { prompt_length: promptLength, prompt_preview: promptPreview },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible
    plausible.trackEvent(plausibleGoals.CHAT_PROMPT, {
      prompt_length: promptLength,
      opportunity_id: opportunityId
    });
  },

  trackEmailSent: (inquiryType: string) => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track email sent - opportunity data not set');
      return;
    }
    
    // Track with Supabase
    trackEvent({
      event_type: 'email_sent',
      event_data: { inquiry_type: inquiryType },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible
    plausible.trackEvent(plausibleGoals.EMAIL_SENT, {
      inquiry_type: inquiryType,
      opportunity_id: opportunityId
    });
  },

  trackDownload: (fileName: string) => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track download - opportunity data not set');
      return;
    }
    
    // Track with Supabase
    trackEvent({
      event_type: 'download',
      event_data: { file_name: fileName },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible
    plausible.trackEvent(plausibleGoals.DOWNLOAD, {
      file_name: fileName,
      opportunity_id: opportunityId
    });
  },

  trackChatStart: (source: 'hero' | 'contact' | 'floating_button') => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track chat start - opportunity data not set');
      return;
    }
    
    // Track with Supabase
    trackEvent({
      event_type: 'chat_started',
      event_data: { source },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible
    plausible.trackEvent(plausibleGoals.CHAT_STARTED, {
      source: source,
      opportunity_id: opportunityId
    });
  },

  trackExternalLink: (platform: 'github' | 'linkedin', context?: string) => {
    if (!opportunityId || !themeId) {
      console.warn('Analytics: Cannot track external link - opportunity data not set');
      return;
    }
    
    // Track with Supabase
    trackEvent({
      event_type: 'external_link_click',
      event_data: { platform, context },
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      theme_id: themeId
    });

    // Track with Plausible
    plausible.trackEvent(plausibleGoals.EXTERNAL_LINK, {
      platform: platform,
      context: context || 'unknown',
      opportunity_id: opportunityId
    });
  }
};

// Legacy helper functions for backward compatibility - updated to use new secure approach
export const trackPageView = (opportunityId: string, oppId?: string, themeId?: string, userId?: string) => {
  const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
  const language = document.documentElement.lang || 'en';
  
  trackEvent({
    event_type: 'page_view',
    event_data: { 
      device_type: deviceType,
      language: language,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    },
    page_url: window.location.href,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    opportunity_id: opportunityId,
    theme_id: themeId,
    user_id: userId
  });
};

export const trackButtonClick = (buttonText: string, opportunityId: string, oppId?: string, themeId?: string, userId?: string) => {
  trackEvent({
    event_type: 'button_click',
    event_data: { button_text: buttonText },
    page_url: window.location.href,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    opportunity_id: opportunityId,
    theme_id: themeId,
    user_id: userId
  });
};

export const trackExternalLinkClick = (platform: string, url: string, opportunityId: string, oppId?: string, themeId?: string, userId?: string) => {
  trackEvent({
    event_type: 'external_link_click',
    event_data: { platform, url },
    page_url: window.location.href,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    opportunity_id: opportunityId,
    theme_id: themeId,
    user_id: userId
  });
};

export const trackSectionView = (sectionName: string, opportunityId: string, oppId?: string, themeId?: string, userId?: string) => {
  trackEvent({
    event_type: 'section_view',
    event_data: { section_name: sectionName },
    page_url: window.location.href,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    opportunity_id: opportunityId,
    theme_id: themeId,
    user_id: userId
  });
};

export const trackChatEvent = (eventType: 'chat_started' | 'chat_prompt' | 'chat_ended', data: any, opportunityId: string, oppId?: string, themeId?: string, userId?: string) => {
  trackEvent({
    event_type: eventType,
    event_data: data,
    page_url: window.location.href,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    opportunity_id: opportunityId,
    theme_id: themeId,
    user_id: userId
  });
};

export const trackEmailSent = (success: boolean, opportunityId: string, oppId?: string, themeId?: string, userId?: string) => {
  trackEvent({
    event_type: 'email_sent',
    event_data: { success },
    page_url: window.location.href,
    referrer: document.referrer || undefined,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    opportunity_id: opportunityId,
    theme_id: themeId,
    user_id: userId
  });
};
