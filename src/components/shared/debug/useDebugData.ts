
import { useMemo } from 'react';
import { getDebugConfig } from './config';
import { useDebugEnvironment } from './hooks/useDebugEnvironment';
import { useDebugInfo } from './hooks/useDebugInfo';
import { useOpportunityDebugInfo } from './hooks/useOpportunityDebugInfo';

export const useDebugData = () => {
  const config = getDebugConfig();
  const { shouldShowDebugPanel, debugToolsEnabled } = useDebugEnvironment();
  
  const isVisible = shouldShowDebugPanel;
  
  const { debugInfo, isInitialized } = useDebugInfo(isVisible);
  const {
    opportunityDebugInfo,
    shouldShowOpportunityContext,
    opportunityLoading,
    opportunityError
  } = useOpportunityDebugInfo();

  console.log('useDebugData: Current state:', {
    isVisible,
    debugToolsEnabled,
    shouldShowDebugPanel,
    debugInfo: !!debugInfo,
    isInitialized
  });

  return {
    debugInfo,
    opportunityDebugInfo,
    isVisible,
    shouldShowOpportunityContext,
    opportunityLoading,
    opportunityError,
    isInitialized,
    shouldShowDebugPanel,
    debugToolsEnabled,
    config,
  };
};
