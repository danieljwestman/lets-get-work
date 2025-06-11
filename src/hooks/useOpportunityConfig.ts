
import { useEffect } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './utils/OpportunityRequestManager';
import { OpportunityFetcher } from './utils/opportunityFetcher';
import { useOpportunityState } from './utils/useOpportunityState';

const requestManager = new OpportunityRequestManager();
const opportunityFetcher = new OpportunityFetcher(requestManager);

export const useOpportunityConfig = (subdomain: string | null) => {
  const { state, updateState, resetState, refs } = useOpportunityState();

  // Single consolidated useEffect to handle all opportunity loading logic
  useEffect(() => {
    const fetchOpportunityConfig = async () => {
      // Don't fetch if subdomain is null (not yet initialized)
      if (subdomain === null) {
        console.log('🔧 OPPORTUNITY CONFIG: Subdomain is null, waiting for initialization');
        return;
      }

      // Skip if subdomain hasn't changed
      if (refs.lastSubdomain.current === subdomain) {
        console.log('🔧 OPPORTUNITY CONFIG: Subdomain unchanged, skipping fetch:', subdomain);
        return;
      }

      const requestId = `opp-${subdomain}-${Date.now()}-${Math.random()}`;
      updateState({ currentRequestId: requestId });

      // Clear cache for previous subdomain to prevent contamination
      if (refs.lastSubdomain.current && refs.lastSubdomain.current !== subdomain) {
        requestManager.clearCacheForSubdomain(refs.lastSubdomain.current);
      }

      updateState({ 
        isLoading: true, 
        error: null, 
        lastSubdomain: subdomain 
      });

      const result = await opportunityFetcher.fetchOpportunityConfig(
        subdomain, 
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

      console.log('🔧 OPPORTUNITY CONFIG: Fetch completed for subdomain:', subdomain, 'RequestID:', requestId);
    };

    if (subdomain !== null) {
      console.log('🔧 OPPORTUNITY CONFIG: useEffect triggered with subdomain:', subdomain);
      fetchOpportunityConfig();
    } else {
      console.log('🔧 OPPORTUNITY CONFIG: Subdomain is null, waiting for initialization');
      updateState({
        isLoading: true,
        error: null,
        opportunity: null
      });
    }

    // Cleanup function
    return () => {
      if (refs.currentRequestId.current) {
        console.log('🔧 OPPORTUNITY CONFIG: Cleaning up request:', refs.currentRequestId.current);
        requestManager.dequeueRequest(refs.currentRequestId.current);
      }
    };
  }, [subdomain]); // FIXED: Only depend on subdomain, not state.opportunity

  // Log whenever opportunity state changes
  console.log('🔧 OPPORTUNITY CONFIG: State changed:', {
    hasOpportunity: !!state.opportunity,
    opportunityId: state.opportunity?.opportunity_id,
    opportunitySubdomain: state.opportunity?.subdomain,
    currentSubdomain: subdomain,
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
