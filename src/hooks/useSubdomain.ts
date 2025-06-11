
import { useState, useEffect, useRef } from 'react';

export const useSubdomain = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const isInitialized = useRef(false);
  const lastUrl = useRef<string>('');
  const currentRequestId = useRef<string>('');

  // Synchronous subdomain detection function
  const detectSubdomainSync = (url: string): string => {
    try {
      const urlObj = new URL(url);
      
      // Check for testing query parameter first
      const urlParams = new URLSearchParams(urlObj.search);
      const testOpportunity = urlParams.get('opportunity');
      
      if (testOpportunity) {
        console.log('🔧 SUBDOMAIN: Using opportunity parameter:', testOpportunity, 'URL:', url);
        return testOpportunity;
      }

      const hostname = urlObj.hostname;
      console.log('🔧 SUBDOMAIN: Checking hostname:', hostname, 'URL:', url);
      
      // Check if this is any kind of preview domain or development environment
      const isPreviewOrDev = hostname.includes('preview--') || 
                            hostname.includes('.lovable.app') ||
                            hostname.includes('localhost') || 
                            hostname.includes('lovableproject.com') || 
                            hostname.includes('127.0.0.1') ||
                            hostname.includes('lovable.dev');
      
      if (isPreviewOrDev) {
        console.log('🔧 SUBDOMAIN: Preview/development environment detected, using default subdomain');
        return 'default';
      }
      
      // Extract subdomain from hostname for production
      const parts = hostname.split('.');
      
      // If we have a subdomain (more than 2 parts), extract it
      if (parts.length > 2) {
        const extractedSubdomain = parts[0];
        console.log('🔧 SUBDOMAIN: Extracted subdomain from hostname:', extractedSubdomain);
        return extractedSubdomain;
      } else {
        // No subdomain, use default
        console.log('🔧 SUBDOMAIN: No subdomain in hostname, using default');
        return 'default';
      }
    } catch (error) {
      console.error('🔧 SUBDOMAIN: Error parsing URL:', error);
      return 'default';
    }
  };

  const updateSubdomain = () => {
    const currentUrl = window.location.href;
    const requestId = `subdomain-${Date.now()}-${Math.random()}`;
    currentRequestId.current = requestId;
    
    // Prevent duplicate processing for the same URL
    if (lastUrl.current === currentUrl && isInitialized.current) {
      console.log('🔧 SUBDOMAIN: URL unchanged, skipping update:', currentUrl);
      return;
    }
    
    console.log('🔧 SUBDOMAIN: Processing URL change:', currentUrl, 'RequestID:', requestId);
    lastUrl.current = currentUrl;
    
    // Synchronously detect subdomain
    const detectedSubdomain = detectSubdomainSync(currentUrl);
    
    // Only update if this is still the latest request
    if (currentRequestId.current === requestId) {
      console.log('🔧 SUBDOMAIN: Setting subdomain:', detectedSubdomain, 'RequestID:', requestId);
      setSubdomain(detectedSubdomain);
      isInitialized.current = true;
    } else {
      console.log('🔧 SUBDOMAIN: Request superseded, ignoring:', requestId);
    }
  };

  useEffect(() => {
    // Initial load with immediate execution
    console.log('🔧 SUBDOMAIN: Initial load, current URL:', window.location.href);
    updateSubdomain();

    // Listen for URL changes (back/forward navigation, manual URL changes)
    const handlePopState = () => {
      console.log('🔧 SUBDOMAIN: PopState event detected, URL:', window.location.href);
      updateSubdomain();
    };

    const handleHashChange = () => {
      console.log('🔧 SUBDOMAIN: HashChange event detected, URL:', window.location.href);
      updateSubdomain();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    // Also listen for any manual URL changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      console.log('🔧 SUBDOMAIN: PushState detected, new URL:', window.location.href);
      setTimeout(updateSubdomain, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      console.log('🔧 SUBDOMAIN: ReplaceState detected, new URL:', window.location.href);
      setTimeout(updateSubdomain, 0);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Log whenever subdomain actually changes
  useEffect(() => {
    if (subdomain !== null) {
      console.log('🔧 SUBDOMAIN: Subdomain state changed to:', subdomain);
    }
  }, [subdomain]);

  return subdomain;
};
