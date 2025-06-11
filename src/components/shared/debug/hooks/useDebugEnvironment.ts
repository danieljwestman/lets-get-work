
import { useState, useEffect } from 'react';

export const useDebugEnvironment = () => {
  // Primary source of truth is localStorage, with fallback to false
  const [debugToolsEnabled, setDebugToolsEnabled] = useState(() => {
    try {
      return localStorage.getItem('debug-tools-enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [debugMode, setDebugMode] = useState(() => {
    try {
      return localStorage.getItem('debug-mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDebugMode = () => {
    const newValue = !debugMode;
    try {
      localStorage.setItem('debug-mode', newValue.toString());
      setDebugMode(newValue);
      
      // Dispatch custom event for immediate effect
      window.dispatchEvent(new CustomEvent('debug-mode-changed', {
        detail: { debugMode: newValue }
      }));
    } catch (error) {
      console.error('Failed to toggle debug mode:', error);
    }
  };

  const toggleDebugTools = (enabled: boolean) => {
    try {
      localStorage.setItem('debug-tools-enabled', enabled.toString());
      setDebugToolsEnabled(enabled);
      
      // Dispatch event for immediate UI updates
      window.dispatchEvent(new Event('debug-tools-toggled'));
    } catch (error) {
      console.error('Failed to toggle debug tools:', error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'debug-mode') {
        setDebugMode(e.newValue === 'true');
      } else if (e.key === 'debug-tools-enabled') {
        setDebugToolsEnabled(e.newValue === 'true');
      }
    };

    const handleDebugModeChanged = (e: CustomEvent) => {
      setDebugMode(e.detail.debugMode);
    };

    const handleDebugToolsToggled = () => {
      try {
        const enabled = localStorage.getItem('debug-tools-enabled') === 'true';
        setDebugToolsEnabled(enabled);
      } catch {
        setDebugToolsEnabled(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('debug-mode-changed', handleDebugModeChanged as EventListener);
    window.addEventListener('debug-tools-toggled', handleDebugToolsToggled);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('debug-mode-changed', handleDebugModeChanged as EventListener);
      window.removeEventListener('debug-tools-toggled', handleDebugToolsToggled);
    };
  }, []);

  return {
    debugMode,
    debugToolsEnabled,
    toggleDebugMode,
    toggleDebugTools,
    isProduction: import.meta.env.PROD,
    // Debug panel should show if tools are enabled OR in dev mode
    shouldShowDebugPanel: debugToolsEnabled || (!import.meta.env.PROD && debugMode)
  };
};
