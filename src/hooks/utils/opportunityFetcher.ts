
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './OpportunityRequestManager';
import { validateOpportunityProfile, validateFetchedOpportunity, validateOpportunityBeforeSet } from './opportunityValidation';
import { transformOpportunityData } from './opportunityDataTransformer';
import { fetchOpportunityByProfile, fetchThemeData, fetchOwnerProfile } from './opportunityDataService';

export interface OpportunityFetchResult {
  opportunity: OpportunityWithTheme | null;
  error: string | null;
}

export class OpportunityFetcher {
  private requestManager: OpportunityRequestManager;

  constructor(requestManager: OpportunityRequestManager) {
    this.requestManager = requestManager;
  }

  async fetchOpportunityConfig(
    profileId: string,
    opportunityId: string,
    requestId: string,
    currentOpportunity: OpportunityWithTheme | null,
    isDirect: boolean = false
  ): Promise<OpportunityFetchResult> {
    const maxRetries = isDirect ? 3 : 1;
    let lastError: any = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log('🔧 OPPORTUNITY FETCHER: Starting fetch attempt', attempt + 1, 'for profile ID:', profileId, 'Opportunity ID:', opportunityId, 'RequestID:', requestId);

        // Validation check - ensure opportunity matches profile ID and opportunity ID
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

        // Check cache first (using combined key)
        const cacheKey = `${profileId}-${opportunityId}`;
        const cached = this.requestManager.getCachedResult(cacheKey);
        if (cached && attempt === 0) { // Only use cache on first attempt
          if (validateOpportunityProfile(cached.opportunity, profileId)) {
            console.log('🔧 OPPORTUNITY FETCHER: Using cached result for:', cacheKey);
            return {
              opportunity: cached.opportunity,
              error: cached.error
            };
          } else {
            // Invalid cached data, clear it
            this.requestManager.clearCacheForSubdomain(cacheKey);
          }
        }

        // Enqueue request and get abort controller
        const requestType = isDirect ? 'direct' : 'subdomain';
        const controller = this.requestManager.enqueueRequest(cacheKey, requestId, isDirect ? 2 : 1, requestType);

        // Add exponential backoff delay for retries
        if (attempt > 0) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log('🔧 OPPORTUNITY FETCHER: Retrying after delay:', delay, 'ms');
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Fetch by profile_id and opportunity_id
        console.log('🔧 OPPORTUNITY FETCHER: Fetching by profile ID:', profileId, 'and opportunity ID:', opportunityId);
        const opportunityData = await fetchOpportunityByProfile(profileId, opportunityId, controller, requestId);

        // Check if request is still valid
        if (!this.requestManager.isRequestValid(requestId)) {
          console.log('🔧 OPPORTUNITY FETCHER: Request cancelled or superseded:', profileId, 'RequestID:', requestId);
          return { opportunity: null, error: null };
        }

        if (!opportunityData || opportunityData.length === 0) {
          console.log('🔧 OPPORTUNITY FETCHER: No opportunity found for profile ID:', profileId, 'and opportunity ID:', opportunityId, 'RequestID:', requestId);
          const errorMsg = `Opportunity not found for profile: ${profileId}, opportunity: ${opportunityId}`;
          this.requestManager.setCachedResult(cacheKey, null, errorMsg);
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

        // Set the profile_id on owner profile to match the resolved profile_id
        if (ownerProfile) {
          ownerProfile.profile_id = profileId;
          console.log('🔧 OPPORTUNITY FETCHER: Set profile_id on owner profile:', profileId);
        }

        // Transform the data to match the expected structure
        console.log('🔧 OPPORTUNITY FETCHER: Transforming data with owner profile:', {
          hasOwnerProfile: !!ownerProfile,
          ownerFullName: ownerProfile?.full_name,
          profileId: profileId,
          requestId
        });
        const transformedOpportunity = transformOpportunityData(fetchedOpportunity, theme, requestId, ownerProfile);

        // Ensure the transformed opportunity uses the correct profile_id
        transformedOpportunity.profile_id = profileId;
        console.log('🔧 OPPORTUNITY FETCHER: Set transformed opportunity profile_id:', transformedOpportunity.profile_id);

        // Final validation
        if (!validateOpportunityBeforeSet(transformedOpportunity, profileId, requestId)) {
          const errorMsg = `Final validation failed: opportunity profile ID mismatch`;
          this.requestManager.setCachedResult(cacheKey, null, errorMsg);
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
        this.requestManager.setCachedResult(cacheKey, transformedOpportunity, null);
        
        return { opportunity: transformedOpportunity, error: null };
        
      } catch (err) {
        lastError = err;
        
        // Handle AbortError specifically - retry for direct requests
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('🔧 OPPORTUNITY FETCHER: Request aborted for profile ID:', profileId, 'RequestID:', requestId, 'Attempt:', attempt + 1);
          
          if (isDirect && attempt < maxRetries - 1) {
            console.log('🔧 OPPORTUNITY FETCHER: Will retry aborted direct request');
            continue; // Retry for direct requests
          }
          
          return { opportunity: null, error: null };
        }
        
        console.error('❌ OPPORTUNITY FETCHER: Error fetching opportunity config:', err, 'RequestID:', requestId, 'Attempt:', attempt + 1);
        
        // Don't retry for non-abort errors
        break;
      }
    }
    
    // If we get here, all retries failed
    const errorMsg = lastError instanceof Error ? lastError.message : 'Failed to load opportunity';
    
    // Cache the error result
    const cacheKey = `${profileId}-${opportunityId}`;
    this.requestManager.setCachedResult(cacheKey, null, errorMsg);
    return { opportunity: null, error: errorMsg };
    
    // Clean up the request in finally block would go here, but it's handled in useOpportunityConfig
  }
}
