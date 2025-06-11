import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { domainConfig } from '@/services/domainConfig';
import { DebugInfo } from '../types';

export const useDebugInfo = (isVisible: boolean) => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  const createDebugInfo = useCallback((configData?: any): DebugInfo => {
    return {
      environment: configData?.environment || 'dev',
      mainDomain: configData?.mainDomain || window.location.hostname,
      contactEmail: configData?.contactEmail || 'Not loaded',
      companyWebsite: configData?.companyWebsite || window.location.origin,
      defaultSenderName: configData?.defaultSenderName || 'Debug Mode',
      currentRoute: location.pathname,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };
  }, [location.pathname]);

  // Initialize debug info immediately when visible
  useEffect(() => {
    if (!isVisible) {
      setIsInitialized(true);
      return;
    }

    console.log('🔧 DEBUG PANEL: Initializing debug info...');
    
    // Set immediate fallback info and mark as initialized right away
    const fallbackInfo = createDebugInfo();
    setDebugInfo(fallbackInfo);
    setIsInitialized(true);
    
    console.log('🔧 DEBUG PANEL: Set fallback info and marked as initialized:', fallbackInfo);
    
    // Optionally try to enhance with real config in background
    const enhanceWithConfig = async () => {
      try {
        console.log('🔧 DEBUG PANEL: Attempting to enhance with domain config...');
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Config fetch timeout')), 3000)
        );
        
        const config = await Promise.race([domainConfig.getConfig(), timeoutPromise]);
        
        console.log('🔧 DEBUG PANEL: Enhanced with domain config:', config);
        setDebugInfo(createDebugInfo(config));
      } catch (error) {
        console.log('🔧 DEBUG PANEL: Could not enhance with config, keeping fallback:', error);
        // Keep the fallback info - no problem
      }
    };

    // Run enhancement in background but don't wait for it
    enhanceWithConfig();
  }, [isVisible, createDebugInfo]);

  // Update current route when it changes
  useEffect(() => {
    if (isVisible && debugInfo && debugInfo.currentRoute !== location.pathname) {
      setDebugInfo(prev => prev ? {
        ...prev,
        currentRoute: location.pathname
      } : null);
    }
  }, [location.pathname, isVisible, debugInfo]);

  // Update viewport on resize
  useEffect(() => {
    if (!isVisible) return;

    const updateViewport = () => {
      setDebugInfo(prev => prev ? {
        ...prev,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      } : null);
    };

    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [isVisible]);

  return {
    debugInfo,
    isInitialized
  };
};
