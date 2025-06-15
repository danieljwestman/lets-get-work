
import { useEffect } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './utils/OpportunityRequestManager';
import { OpportunityFetcher } from './utils/opportunityFetcher';
import { useOpportunityState } from './utils/useOpportunityState';

const requestManager = new OpportunityRequestManager();
const opportunityFetcher = new OpportunityFetcher(requestManager);

export const useOpportunityConfig = (profileId: string | null) => {
  const { state, updateState, resetState, refs } = useOpportunityState();

  // Single consolidated useEffect to handle all opportunity loading logic
  useEffect(() => {
    const fetchOpportunityConfig = async () => {
      // Don't fetch if profileId is null (not yet initialized)
      if (profileId === null) {
        console.log('🔧 OPPORTUNITY CONFIG: Profile ID is null, waiting for initialization');
        return;
      }

      // Skip if profileId hasn't changed
      if (refs.lastSubdomain.current === profileId) {
        console.log('🔧 OPPORTUNITY CONFIG: Profile ID unchanged, skipping fetch:', profileId);
        return;
      }

      const requestId = `opp-${profileId}-${Date.now()}-${Math.random()}`;
      updateState({ currentRequestId: requestId });

      // Clear cache for previous profile ID to prevent contamination
      if (refs.lastSubdomain.current && refs.lastSubdomain.current !== profileId) {
        requestManager.clearCacheForSubdomain(refs.lastSubdomain.current);
      }

      updateState({ 
        isLoading: true, 
        error: null, 
        lastSubdomain: profileId 
      });

      const result = await opportunityFetcher.fetchOpportunityConfig(
        profileId, 
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

      console.log('🔧 OPPORTUNITY CONFIG: Fetch completed for profile ID:', profileId, 'RequestID:', requestId);
    };

    if (profileId !== null) {
      console.log('🔧 OPPORTUNITY CONFIG: useEffect triggered with profile ID:', profileId);
      fetchOpportunityConfig();
    } else {
      console.log('🔧 OPPORTUNITY CONFIG: Profile ID is null, waiting for initialization');
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
  }, [profileId]); // FIXED: Only depend on profileId, not state.opportunity

  // Log whenever opportunity state changes
  console.log('🔧 OPPORTUNITY CONFIG: State changed:', {
    hasOpportunity: !!state.opportunity,
    opportunityId: state.opportunity?.opportunity_id,
    opportunityProfileId: state.opportunity?.profile_id,
    currentProfileId: profileId,
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
