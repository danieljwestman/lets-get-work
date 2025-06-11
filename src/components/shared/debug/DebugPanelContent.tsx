
import React from 'react';
import { Globe, User, Briefcase, Monitor } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DebugInfo, OpportunityDebugInfo } from './types';
import { SystemInfo } from './SystemInfo';
import { AuthInfo } from './AuthInfo';
import { OpportunityInfo } from './OpportunityInfo';
import { TechnicalInfo } from './TechnicalInfo';

// Memoized components for performance
const MemoizedSystemInfo = React.memo(SystemInfo);
const MemoizedAuthInfo = React.memo(AuthInfo);
const MemoizedOpportunityInfo = React.memo(OpportunityInfo);
const MemoizedTechnicalInfo = React.memo(TechnicalInfo);

interface DebugPanelContentProps {
  debugInfo: DebugInfo | null;
  opportunityDebugInfo: OpportunityDebugInfo | null;
  shouldShowOpportunityContext: boolean;
  opportunityLoading: boolean;
  opportunityError: string | null;
  defaultSections: string[];
  memoryUsage: any;
}

export const DebugPanelContent: React.FC<DebugPanelContentProps> = ({
  debugInfo,
  opportunityDebugInfo,
  shouldShowOpportunityContext,
  opportunityLoading,
  opportunityError,
  defaultSections,
  memoryUsage
}) => {
  if (!debugInfo) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading debug information...
      </div>
    );
  }

  return (
    <Accordion 
      type="multiple" 
      defaultValue={defaultSections}
      className="w-full"
    >
      <AccordionItem value="system" className="border-b border-gray-100">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="font-medium text-gray-800">System</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-0 pb-0">
          <MemoizedSystemInfo debugInfo={debugInfo} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="auth" className="border-b border-gray-100">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span className="font-medium text-gray-800">Authentication</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-0 pb-0">
          <MemoizedAuthInfo />
        </AccordionContent>
      </AccordionItem>

      {shouldShowOpportunityContext && (
        <AccordionItem value="opportunity" className="border-b border-gray-100">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="font-medium text-gray-800">Opportunity</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
            <MemoizedOpportunityInfo
              opportunityDebugInfo={opportunityDebugInfo}
              opportunityLoading={opportunityLoading}
              opportunityError={opportunityError}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="technical" className="border-b-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="font-medium text-gray-800">Technical</span>
            {memoryUsage && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {memoryUsage.used}MB
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-0 pb-0">
          <MemoizedTechnicalInfo debugInfo={debugInfo} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
