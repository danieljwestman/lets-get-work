
import { useEffect } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './utils/OpportunityRequestManager';
import { OpportunityDirectFetcher } from './utils/opportunityDirectFetcher';
import { useOpportunityState } from './utils/useOpportunityState';

const requestManager = new OpportunityRequestManager();
const opportunityDirectFetcher = new OpportunityDirectFetcher(requestManager);

export const useOpportunityDirectConfig = (opportunityId: string | null) => {
  const { state, updateState, resetState, refs } = useOpportunityState();

  // Single consolidated useEffect to handle direct opportunity loading logic
  useEffect(() => {
    const fetchOpportunityConfig = async () => {
      // Don't fetch if opportunityId is null
      if (opportunityId === null) {
        console.log('🔧 OPPORTUNITY DIRECT CONFIG: Opportunity ID is null, not fetching');
        updateState({
          opportunity: null,
          isLoading: false,
          error: null
        });
        return;
      }

      // Skip if the configuration hasn't changed
      if (refs.lastSubdomain.current === opportunityId) {
        console.log('🔧 OPPORTUNITY DIRECT CONFIG: Configuration unchanged, skipping fetch:', opportunityId);
        return;
      }

      const requestId = `opp-direct-${opportunityId}-${Date.now()}-${Math.random()}`;
      updateState({ currentRequestId: requestId });

      // Clear cache for previous configuration to prevent contamination
      if (refs.lastSubdomain.current && refs.lastSubdomain.current !== opportunityId) {
        requestManager.clearCacheForSubdomain(refs.lastSubdomain.current);
      }

      updateState({ 
        isLoading: true, 
        error: null, 
        lastSubdomain: opportunityId 
      });

      const result = await opportunityDirectFetcher.fetchOpportunityConfig(
        opportunityId,
        requestId, 
        state.opportunity
      );

      // Only update state if this is still the current request
      if (refs.currentRequestId.current === requestId) {
        updateState({
          opportunity: result.opportunity,
          error: result.error,
          isLoading: false
        });
      }

      console.log('🔧 OPPORTUNITY DIRECT CONFIG: Fetch completed for opportunity ID:', opportunityId, 'RequestID:', requestId);
    };

    console.log('🔧 OPPORTUNITY DIRECT CONFIG: useEffect triggered with opportunity ID:', opportunityId);
    fetchOpportunityConfig();

    // Cleanup function
    return () => {
      if (refs.currentRequestId.current) {
        console.log('🔧 OPPORTUNITY DIRECT CONFIG: Cleaning up request:', refs.currentRequestId.current);
        requestManager.dequeueRequest(refs.currentRequestId.current);
      }
    };
  }, [opportunityId]); // Only depend on opportunityId

  // Log whenever opportunity state changes
  console.log('🔧 OPPORTUNITY DIRECT CONFIG: State changed:', {
    hasOpportunity: !!state.opportunity,
    opportunityId: state.opportunity?.opportunity_id,
    currentOpportunityId: opportunityId,
    themeId: state.opportunity?.theme.theme_id,
    userId: state.opportunity?.user_id,
    isLoading: state.isLoading,
    error: state.error
  });

  return { 
    opportunity: state.opportunity, 
    isLoading: state.isLoading, 
    error: state.error 
  };
};
