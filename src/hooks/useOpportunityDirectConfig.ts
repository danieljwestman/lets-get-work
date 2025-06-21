
import { useEffect } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './utils/OpportunityRequestManager';
import { OpportunityDirectFetcher } from './utils/opportunityDirectFetcher';
import { useOpportunityState } from './utils/useOpportunityState';

const requestManager = new OpportunityRequestManager();
const opportunityDirectFetcher = new OpportunityDirectFetcher(requestManager);

export const useOpportunityDirectConfig = (userId: string | null, opportunityId: string | null) => {
  const { state, updateState, resetState, refs } = useOpportunityState();

  // Single consolidated useEffect to handle direct opportunity loading logic
  useEffect(() => {
    const fetchOpportunityConfig = async () => {
      // Don't fetch if either userId or opportunityId is null
      if (userId === null || opportunityId === null) {
        console.log('🔧 OPPORTUNITY DIRECT CONFIG: User ID or Opportunity ID is null, not fetching');
        updateState({
          opportunity: null,
          isLoading: false,
          error: null
        });
        return;
      }

      // Create a unique key that includes both user and opportunity ID
      const configKey = `${userId}-${opportunityId}`;

      // Skip if the configuration hasn't changed
      if (refs.lastSubdomain.current === configKey) {
        console.log('🔧 OPPORTUNITY DIRECT CONFIG: Configuration unchanged, skipping fetch:', configKey);
        return;
      }

      const requestId = `opp-direct-${userId}-${opportunityId}-${Date.now()}-${Math.random()}`;
      updateState({ currentRequestId: requestId });

      // Clear cache for previous configuration to prevent contamination
      if (refs.lastSubdomain.current && refs.lastSubdomain.current !== configKey) {
        requestManager.clearCacheForSubdomain(refs.lastSubdomain.current);
      }

      updateState({ 
        isLoading: true, 
        error: null, 
        lastSubdomain: configKey 
      });

      const result = await opportunityDirectFetcher.fetchOpportunityConfig(
        userId,
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

      console.log('🔧 OPPORTUNITY DIRECT CONFIG: Fetch completed for user ID:', userId, 'opportunity ID:', opportunityId, 'RequestID:', requestId);
    };

    console.log('🔧 OPPORTUNITY DIRECT CONFIG: useEffect triggered with user ID:', userId, 'opportunity ID:', opportunityId);
    fetchOpportunityConfig();

    // Cleanup function
    return () => {
      if (refs.currentRequestId.current) {
        console.log('🔧 OPPORTUNITY DIRECT CONFIG: Cleaning up request:', refs.currentRequestId.current);
        requestManager.dequeueRequest(refs.currentRequestId.current);
      }
    };
  }, [userId, opportunityId]); // Depend on both userId and opportunityId

  // Log whenever opportunity state changes
  console.log('🔧 OPPORTUNITY DIRECT CONFIG: State changed:', {
    hasOpportunity: !!state.opportunity,
    opportunityId: state.opportunity?.opportunity_id,
    currentUserId: userId,
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
