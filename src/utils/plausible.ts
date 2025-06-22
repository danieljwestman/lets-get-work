
// Plausible Analytics Integration
// This module provides a simple interface to track events with Plausible

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

export const plausible = {
  // Track a custom event with optional properties
  trackEvent: (eventName: string, properties?: Record<string, string | number>) => {
    try {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(eventName, properties ? { props: properties } : undefined);
        console.log('📊 Plausible: Tracked event:', eventName, properties);
      }
    } catch (error) {
      console.warn('📊 Plausible: Error tracking event:', error);
    }
  },

  // Track page view (handled automatically by Plausible script)
  trackPageView: () => {
    // Plausible automatically tracks page views, but we can trigger manual ones if needed
    try {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible('pageview');
        console.log('📊 Plausible: Manual page view tracked');
      }
    } catch (error) {
      console.warn('📊 Plausible: Error tracking page view:', error);
    }
  },

  // Check if Plausible is loaded and available
  isAvailable: (): boolean => {
    return typeof window !== 'undefined' && typeof window.plausible === 'function';
  }
};

// Map our internal event types to Plausible goal names
export const plausibleGoals = {
  PAGE_VIEW: 'Page View',
  CHAT_STARTED: 'Chat Started',
  CHAT_PROMPT: 'Chat Prompt',
  EMAIL_SENT: 'Email Sent',
  BUTTON_CLICK: 'Button Click',
  EXTERNAL_LINK: 'External Link',
  DOWNLOAD: 'Download',
  SECTION_VIEW: 'Section View'
} as const;
