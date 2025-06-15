
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { OpportunityDebugInfo } from '../types';

export const useOpportunityDebugInfo = () => {
  const [opportunityDebugInfo, setOpportunityDebugInfo] = useState<OpportunityDebugInfo | null>(null);
  const location = useLocation();
  const { opportunity, isLoading: opportunityLoading, error: opportunityError } = useOpportunity();

  const shouldShowOpportunityContext = useMemo(() => 
    !location.pathname.startsWith('/dashboard'), 
    [location.pathname]
  );

  useEffect(() => {
    if (!shouldShowOpportunityContext) {
      if (opportunityDebugInfo !== null) {
        setOpportunityDebugInfo(null);
      }
      return;
    }

    if (opportunity && !opportunityLoading && !opportunityError) {
      const actualId = opportunity.id;
      const showActualId = actualId && actualId !== opportunity.opportunity_id;
      
      const newOpportunityInfo = {
        opportunityId: opportunity.opportunity_id,
        actualOpportunityId: showActualId ? actualId : undefined,
        name: opportunity.name,
        profileId: opportunity.profile_id,
        themeId: opportunity.theme.theme_id,
        themeName: opportunity.theme.name,
        companyName: opportunity.company_name,
        targetRole: opportunity.target_role,
        status: opportunity.status,
        userId: opportunity.user_id || undefined
      };

      const hasChanged = !opportunityDebugInfo || 
        JSON.stringify(opportunityDebugInfo) !== JSON.stringify(newOpportunityInfo);
      
      if (hasChanged) {
        console.log('🔧 DEBUG PANEL: Updating opportunity info');
        setOpportunityDebugInfo(newOpportunityInfo);
      }
    } else if (opportunityDebugInfo !== null) {
      setOpportunityDebugInfo(null);
    }
  }, [opportunity, opportunityLoading, opportunityError, shouldShowOpportunityContext, opportunityDebugInfo]);

  return {
    opportunityDebugInfo,
    shouldShowOpportunityContext,
    opportunityLoading,
    opportunityError
  };
};
