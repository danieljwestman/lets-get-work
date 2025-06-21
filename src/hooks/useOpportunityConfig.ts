
import { useEffect } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './utils/OpportunityRequestManager';
import { OpportunityFetcher } from './utils/opportunityFetcher';
import { useOpportunityState } from './utils/useOpportunityState';

const requestManager = new OpportunityRequestManager();
const opportunityFetcher = new OpportunityFetcher(requestManager);

export const useOpportunityConfig = (
  profileId: string | null, 
  opportunityId: string | null = null,
  isDirect: boolean = false // Flag to indicate this is a direct URL-based request (main domain)
) => {
  const { state, updateState, resetState, refs } = useOpportunityState();

  // Single consolidated useEffect to handle all opportunity loading logic
  useEffect(() => {
    const fetchOpportunityConfig = async () => {
      // Don't fetch if profileId is null (main domain or not yet initialized)
      if (profileId === null) {
        console.log('🔧 OPPORTUNITY CONFIG: Profile ID is null, not fetching (main domain or not initialized)');
        updateState({
          opportunity: null,
          isLoading: false,
          error: null
        });
        return;
      }

      // Use 'default' if no specific opportunity ID is provided
      const targetOpportunityId = opportunityId || 'default';

      // Create a unique key that includes both profile and opportunity ID
      const configKey = `${profileId}-${targetOpportunityId}`;

      // Skip if the configuration hasn't changed
      if (refs.lastSubdomain.current === configKey) {
        console.log('🔧 OPPORTUNITY CONFIG: Configuration unchanged, skipping fetch:', configKey);
        return;
      }

      const requestId = `opp-${profileId}-${targetOpportunityId}-${Date.now()}-${Math.random()}`;
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

      console.log('🔧 OPPORTUNITY CONFIG: Starting fetch with isDirect:', isDirect, 'for:', configKey);

      const result = await opportunityFetcher.fetchOpportunityConfig(
        profileId, 
        targetOpportunityId,
        requestId, 
        state.opportunity,
        isDirect
      );

      // Only update state if this is still the current request
      if (refs.currentRequestId.current === requestId) {
        // For direct requests, distinguish between AbortError (don't show error) and real errors
        if (result.error && result.error.includes('AbortError')) {
          console.log('🔧 OPPORTUNITY CONFIG: Ignoring AbortError for direct request');
          updateState({
            isLoading: false
          });
        } else {
          updateState({
            opportunity: result.opportunity,
            error: result.error,
            isLoading: false
          });
        }
      }

      console.log('🔧 OPPORTUNITY CONFIG: Fetch completed for profile ID:', profileId, 'Opportunity ID:', targetOpportunityId, 'RequestID:', requestId);
    };

    console.log('🔧 OPPORTUNITY CONFIG: useEffect triggered with profile ID:', profileId, 'opportunity ID:', opportunityId, 'isDirect:', isDirect);
    fetchOpportunityConfig();

    // Cleanup function
    return () => {
      if (refs.currentRequestId.current) {
        console.log('🔧 OPPORTUNITY CONFIG: Cleaning up request:', refs.currentRequestId.current);
        requestManager.dequeueRequest(refs.currentRequestId.current);
      }
    };
  }, [profileId, opportunityId, isDirect]); // Include isDirect in dependencies

  // Log whenever opportunity state changes
  console.log('🔧 OPPORTUNITY CONFIG: State changed:', {
    hasOpportunity: !!state.opportunity,
    opportunityId: state.opportunity?.opportunity_id,
    opportunityProfileId: state.opportunity?.profile_id,
    currentProfileId: profileId,
    targetOpportunityId: opportunityId,
    themeId: state.opportunity?.theme.theme_id,
    userId: state.opportunity?.user_id,
    isLoading: state.isLoading,
    error: state.error,
    isDirect
  });

  return { 
    opportunity: state.opportunity, 
    isLoading: state.isLoading, 
    error: state.error 
  };
};
