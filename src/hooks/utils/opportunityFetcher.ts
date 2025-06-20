
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './OpportunityRequestManager';
import { validateOpportunityProfile, validateFetchedOpportunity, validateOpportunityBeforeSet } from './opportunityValidation';
import { transformOpportunityData } from './opportunityDataTransformer';
import { fetchOpportunityByProfile, fetchOpportunityByUserId, fetchThemeData, fetchOwnerProfile } from './opportunityDataService';
import { supabase } from '@/integrations/supabase/client';

export interface OpportunityFetchResult {
  opportunity: OpportunityWithTheme | null;
  error: string | null;
}

// Helper function to check if a string is a UUID
const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export class OpportunityFetcher {
  private requestManager: OpportunityRequestManager;

  constructor(requestManager: OpportunityRequestManager) {
    this.requestManager = requestManager;
  }

  async fetchOpportunityConfig(
    profileId: string,
    requestId: string,
    currentOpportunity: OpportunityWithTheme | null
  ): Promise<OpportunityFetchResult> {
    try {
      console.log('🔧 OPPORTUNITY FETCHER: Starting fetch for profile ID:', profileId, 'RequestID:', requestId);

      // Validation check - ensure opportunity matches profile ID
      if (currentOpportunity && profileId && currentOpportunity.profile_id !== profileId) {
        console.error('🔧 OPPORTUNITY FETCHER: CRITICAL ERROR - Opportunity profile ID mismatch!', {
          currentProfileId: profileId,
          opportunityProfileId: currentOpportunity.profile_id,
          opportunityId: currentOpportunity.opportunity_id
        });
        
        // Clear cache and return error
        this.requestManager.clearCacheForSubdomain(profileId);
        return {
          opportunity: null,
          error: `State correction: wrong opportunity detected`
        };
      }

      // Check cache first
      const cached = this.requestManager.getCachedResult(profileId);
      if (cached) {
        // Validate cached opportunity
        if (validateOpportunityProfile(cached.opportunity, profileId)) {
          console.log('🔧 OPPORTUNITY FETCHER: Using cached result for:', profileId);
          return {
            opportunity: cached.opportunity,
            error: cached.error
          };
        } else {
          // Invalid cached data, clear it
          this.requestManager.clearCacheForSubdomain(profileId);
        }
      }

      // Enqueue request and get abort controller
      const controller = this.requestManager.enqueueRequest(profileId, requestId, 1);

      // Determine if profileId is a UUID (custom domain) or string (subdomain/profile route)
      const isProfileIdUUID = isUUID(profileId);
      console.log('🔧 OPPORTUNITY FETCHER: Profile ID type:', {
        profileId,
        isUUID: isProfileIdUUID,
        requestId
      });

      let opportunityData;
      if (isProfileIdUUID) {
        // For custom domains with UUID, fetch by user_id
        opportunityData = await fetchOpportunityByUserId(profileId, 'default', controller, requestId);
      } else {
        // For subdomains/profile routes with string, fetch by profile_id
        opportunityData = await fetchOpportunityByProfile(profileId, 'default', controller, requestId);
      }

      // Check if request is still valid
      if (!this.requestManager.isRequestValid(requestId)) {
        console.log('🔧 OPPORTUNITY FETCHER: Request cancelled or superseded:', profileId, 'RequestID:', requestId);
        return { opportunity: null, error: null };
      }

      if (!opportunityData || opportunityData.length === 0) {
        console.log('🔧 OPPORTUNITY FETCHER: No opportunity found for profile ID:', profileId, 'RequestID:', requestId);
        const errorMsg = `Opportunity not found for profile: ${profileId}`;
        this.requestManager.setCachedResult(profileId, null, errorMsg);
        return { opportunity: null, error: errorMsg };
      }

      const fetchedOpportunity = opportunityData[0];
      
      console.log('🔧 OPPORTUNITY FETCHER: Found valid opportunity:', {
        name: fetchedOpportunity.name,
        opportunity_id: fetchedOpportunity.opportunity_id,
        theme_id: fetchedOpportunity.theme_id,
        user_id: fetchedOpportunity.user_id,
        requestId
      });

      // Fetch theme data
      const theme = await fetchThemeData(fetchedOpportunity.theme_id, controller, requestId);

      // Check if request is still valid after theme fetch
      if (!this.requestManager.isRequestValid(requestId)) {
        console.log('🔧 OPPORTUNITY FETCHER: Theme request cancelled or superseded:', profileId, 'RequestID:', requestId);
        return { opportunity: null, error: null };
      }

      // Fetch owner profile if user_id exists
      let ownerProfile = null;
      if (fetchedOpportunity.user_id) {
        console.log('🔧 OPPORTUNITY FETCHER: Attempting to fetch owner profile for user_id:', fetchedOpportunity.user_id, 'RequestID:', requestId);
        ownerProfile = await fetchOwnerProfile(fetchedOpportunity.user_id, controller, requestId);
        console.log('🔧 OPPORTUNITY FETCHER: Owner profile fetch result:', {
          ownerProfile,
          hasFullName: !!ownerProfile?.full_name,
          fullName: ownerProfile?.full_name,
          requestId
        });
        
        // Check if request is still valid after profile fetch
        if (!this.requestManager.isRequestValid(requestId)) {
          console.log('🔧 OPPORTUNITY FETCHER: Profile request cancelled or superseded:', profileId, 'RequestID:', requestId);
          return { opportunity: null, error: null };
        }
      } else {
        console.log('🔧 OPPORTUNITY FETCHER: No user_id found, skipping owner profile fetch. RequestID:', requestId);
      }

      // Set profile_id based on the type of lookup we performed
      if (ownerProfile) {
        if (isProfileIdUUID) {
          // For UUID lookups (custom domains), we need to get the actual profile_id from the user's profile
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('profile_id')
            .eq('id', profileId)
            .single();
          
          ownerProfile.profile_id = userProfile?.profile_id || profileId;
        } else {
          // For string lookups (subdomains/profile routes), use the profileId directly
          ownerProfile.profile_id = profileId;
        }
      }

      // Transform the data to match the expected structure
      console.log('🔧 OPPORTUNITY FETCHER: Transforming data with owner profile:', {
        hasOwnerProfile: !!ownerProfile,
        ownerFullName: ownerProfile?.full_name,
        profileId: ownerProfile?.profile_id || profileId,
        requestId
      });
      const transformedOpportunity = transformOpportunityData(fetchedOpportunity, theme, requestId, ownerProfile);

      // For UUID-based lookups, set the profile_id to the original profileId for consistency
      if (isProfileIdUUID && ownerProfile?.profile_id) {
        transformedOpportunity.profile_id = ownerProfile.profile_id;
      }

      // Final validation before setting state
      if (!validateOpportunityBeforeSet(transformedOpportunity, transformedOpportunity.profile_id, requestId)) {
        const errorMsg = `Final validation failed: opportunity profile ID mismatch`;
        this.requestManager.setCachedResult(profileId, null, errorMsg);
        return { opportunity: null, error: errorMsg };
      }
      
      console.log('✅ OPPORTUNITY FETCHER: Transformed opportunity successfully:', {
        opportunity_id: transformedOpportunity.opportunity_id,
        theme_id: transformedOpportunity.theme.theme_id,
        profile_id: transformedOpportunity.profile_id,
        theme_name: transformedOpportunity.theme.name,
        user_id: transformedOpportunity.user_id,
        contact_person: transformedOpportunity.contact_person,
        owner_full_name: transformedOpportunity.owner_full_name,
        requestId
      });
      
      // Cache the successful result
      this.requestManager.setCachedResult(profileId, transformedOpportunity, null);
      
      return { opportunity: transformedOpportunity, error: null };
    } catch (err) {
      // Don't log errors for aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🔧 OPPORTUNITY FETCHER: Request aborted for profile ID:', profileId, 'RequestID:', requestId);
        return { opportunity: null, error: null };
      }
      
      console.error('❌ OPPORTUNITY FETCHER: Error fetching opportunity config:', err, 'RequestID:', requestId);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load opportunity';
      
      // Cache the error result
      this.requestManager.setCachedResult(profileId, null, errorMsg);
      return { opportunity: null, error: errorMsg };
    } finally {
      // Clean up the request
      this.requestManager.dequeueRequest(requestId);
    }
  }
}
