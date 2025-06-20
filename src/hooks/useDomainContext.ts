
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
    
    // Check if we're on a /profiles/:profileId route
    const profileMatch = window.location.pathname.match(/^\/profiles\/([^\/]+)$/);
    if (profileMatch) {
      const profileId = profileMatch[1];
      console.log('🔧 DOMAIN CONTEXT: Detected /profiles/ route for profile ID:', profileId);
      setDomainInfo({
        type: 'subdomain',
        domain: window.location.hostname,
        profileId,
        opportunityId: 'default',
        isMainDomain: false
      });
      isInitialized.current = true;
      return;
    }
    
    const detectedDomainInfo = await DomainRouterService.detectDomainType(window.location.hostname);
    
    // Check for opportunity parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const opportunityParam = urlParams.get('opportunity');
    
    if (opportunityParam && detectedDomainInfo.type === 'subdomain') {
      detectedDomainInfo.opportunityId = opportunityParam;
    } else if (detectedDomainInfo.type === 'subdomain') {
      // Default opportunity for subdomains
      detectedDomainInfo.opportunityId = 'default';
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
