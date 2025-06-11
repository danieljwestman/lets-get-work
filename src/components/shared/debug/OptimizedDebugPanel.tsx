
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDebugData } from './useDebugData';
import { useIsMobile } from '@/hooks/use-mobile';
import { getDebugConfig } from './config';
import { copyToClipboard, formatDebugDataForCopy, measureMemoryUsage } from './utils';
import { DebugBadge } from './DebugBadge';
import { DebugPanelHeader } from './DebugPanelHeader';
import { SecurityWarnings } from './SecurityWarnings';
import { DebugPanelContent } from './DebugPanelContent';
import { DebugPanelFooter } from './DebugPanelFooter';

export const OptimizedDebugPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<any>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const config = getDebugConfig();
  
  const {
    debugInfo,
    opportunityDebugInfo,
    isVisible,
    shouldShowOpportunityContext,
    opportunityLoading,
    opportunityError,
    isInitialized,
    shouldShowDebugPanel,
    debugToolsEnabled
  } = useDebugData();

  console.log('OptimizedDebugPanel: Debug visibility state:', {
    debugToolsEnabled,
    shouldShowDebugPanel,
    isVisible,
    isInitialized,
    debugInfo: !!debugInfo
  });

  // Security monitoring - stable and minimal
  useEffect(() => {
    if (!isVisible) return;
    
    const warnings: string[] = [];
    
    // Only check for insecure connection
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      warnings.push('Insecure connection detected');
    }

    // Only update if warnings actually changed
    if (JSON.stringify(warnings) !== JSON.stringify(securityWarnings)) {
      setSecurityWarnings(warnings);
    }
    
    // Update memory usage - do this less frequently
    if (!memoryUsage) {
      const usage = measureMemoryUsage();
      setMemoryUsage(usage);
    }
  }, [isVisible, securityWarnings, memoryUsage]);

  // Stable expand toggle
  const handleExpandToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleCopyDebugInfo = useCallback(async () => {
    if (!debugInfo) return;
    
    const debugData = {
      system: debugInfo,
      ...(opportunityDebugInfo && { opportunity: opportunityDebugInfo }),
      memory: memoryUsage,
      timestamp: new Date().toISOString(),
    };
    
    const formattedData = formatDebugDataForCopy(debugData);
    const success = await copyToClipboard(formattedData);
    
    toast({
      title: success ? "Debug info copied!" : "Copy failed",
      description: success 
        ? "Debug information has been copied to your clipboard."
        : "Failed to copy debug information. Please try again.",
      variant: success ? "default" : "destructive",
    });
  }, [debugInfo, opportunityDebugInfo, memoryUsage, toast]);

  // Keyboard shortcuts - stable
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey) {
        if (event.key === 'D' || event.key === 'd') {
          event.preventDefault();
          handleExpandToggle();
        } else if (event.key === 'C' || event.key === 'c') {
          event.preventDefault();
          if (isExpanded) {
            handleCopyDebugInfo();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExpandToggle, handleCopyDebugInfo, isExpanded, isVisible]);

  // Stable default sections
  const defaultSections = useMemo(() => {
    return shouldShowOpportunityContext 
      ? ['system', 'auth', 'opportunity', 'technical']
      : ['system', 'auth', 'technical'];
  }, [shouldShowOpportunityContext]);

  console.log('OptimizedDebugPanel: Render decision - shouldShow:', isVisible);

  // Don't render anything if debug tools are not enabled
  if (!isVisible) {
    return null;
  }

  // Improved mobile positioning with better responsive design
  return (
    <div className={`fixed z-[9999] pointer-events-none ${
      isMobile 
        ? 'bottom-4 left-4 right-4' // Full width with margins on mobile
        : 'bottom-4 left-4'
    }`}>
      <div className="pointer-events-auto">
        {!isExpanded ? (
          // Collapsed badge - responsive positioning
          <div className={isMobile ? "flex justify-start" : ""}>
            <DebugBadge
              securityWarnings={securityWarnings}
              truncatedText={null}
              onToggle={handleExpandToggle}
            />
          </div>
        ) : (
          // Expanded panel - improved mobile sizing
          <div className={`bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl overflow-hidden flex flex-col ${
            isMobile 
              ? 'w-full max-h-[70vh]' // Full width with max height on mobile
              : 'w-[480px] max-w-[90vw] max-h-[calc(100vh-2rem)]'
          }`}>
            {/* Enhanced header with actions */}
            <DebugPanelHeader
              debugInfo={debugInfo}
              securityWarnings={securityWarnings}
              onCopyDebugInfo={handleCopyDebugInfo}
              onClose={handleExpandToggle}
            />

            {/* Security warnings section */}
            <SecurityWarnings warnings={securityWarnings} />

            {/* Content - always show since we initialize immediately */}
            <div className="overflow-y-auto flex-1 min-h-0">
              <DebugPanelContent
                debugInfo={debugInfo}
                opportunityDebugInfo={opportunityDebugInfo}
                shouldShowOpportunityContext={shouldShowOpportunityContext}
                opportunityLoading={opportunityLoading}
                opportunityError={opportunityError}
                defaultSections={defaultSections}
                memoryUsage={memoryUsage}
              />
            </div>

            {/* Footer with toggle shortcut */}
            <DebugPanelFooter onToggle={handleExpandToggle} />
          </div>
        )}
      </div>
    </div>
  );
};
