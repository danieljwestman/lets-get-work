
import { useState, useEffect, useRef } from 'react';
import { DomainRouterService, DomainInfo } from '@/services/domainRouterService';

export const useDomainContext = () => {
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
  const isInitialized = useRef(false);
  const lastUrl = useRef<string>('');

  const updateDomainInfo = async () => {
    const currentUrl = window.location.href;
    
    // Prevent duplicate processing for the same URL
    if (lastUrl.current === currentUrl && isInitialized.current) {
      console.log('🔧 DOMAIN CONTEXT: URL unchanged, skipping update:', currentUrl);
      return;
    }
    
    console.log('🔧 DOMAIN CONTEXT: Processing URL change:', currentUrl);
    lastUrl.current = currentUrl;
    
    // Check if we're on a /profiles/:profileId route on the main domain
    const profileMatch = window.location.pathname.match(/^\/profiles\/([^\/]+)$/);
    if (profileMatch) {
      const profileId = profileMatch[1];
      console.log('🔧 DOMAIN CONTEXT: Detected /profiles/ route for profile ID:', profileId);
      
      // This is a main domain route, not a subdomain
      setDomainInfo({
        type: 'main',
        domain: window.location.hostname,
        profileId,
        opportunityId: 'default',
        isMainDomain: true
      });
      isInitialized.current = true;
      return;
    }
    
    const detectedDomainInfo = await DomainRouterService.detectDomainType(window.location.hostname);
    
    // For non-main domains, extract opportunity ID from the URL path
    if (!detectedDomainInfo.isMainDomain) {
      const pathname = window.location.pathname;
      
      // Root path or empty path = default opportunity
      if (pathname === '/' || pathname === '') {
        detectedDomainInfo.opportunityId = 'default';
      } else {
        // Extract opportunity ID from path (remove leading slash)
        const opportunityId = pathname.substring(1);
        
        // Only set if it's a valid opportunity ID (no additional slashes)
        if (opportunityId && !opportunityId.includes('/')) {
          detectedDomainInfo.opportunityId = opportunityId;
        } else {
          // Invalid path structure, default to 'default'
          detectedDomainInfo.opportunityId = 'default';
        }
      }
    }
    
    console.log('🔧 DOMAIN CONTEXT: Detected domain info:', detectedDomainInfo);
    setDomainInfo(detectedDomainInfo);
    isInitialized.current = true;
  };

  useEffect(() => {
    // Initial load
    updateDomainInfo();

    // Listen for URL changes
    const handlePopState = () => {
      console.log('🔧 DOMAIN CONTEXT: PopState event detected');
      updateDomainInfo();
    };

    const handleHashChange = () => {
      console.log('🔧 DOMAIN CONTEXT: HashChange event detected');
      updateDomainInfo();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    // Override history methods to detect programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(updateDomainInfo, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(updateDomainInfo, 0);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return domainInfo;
};
