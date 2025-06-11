
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './OpportunityRequestManager';
import { validateOpportunitySubdomain, validateFetchedOpportunity, validateOpportunityBeforeSet } from './opportunityValidation';
import { transformOpportunityData } from './opportunityDataTransformer';
import { fetchOpportunityData, fetchThemeData, fetchOwnerProfile } from './opportunityDataService';

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
    subdomain: string,
    requestId: string,
    currentOpportunity: OpportunityWithTheme | null
  ): Promise<OpportunityFetchResult> {
    try {
      console.log('🔧 OPPORTUNITY FETCHER: Starting fetch for subdomain:', subdomain, 'RequestID:', requestId);

      // Validation check - ensure opportunity matches subdomain
      if (currentOpportunity && subdomain && currentOpportunity.subdomain !== subdomain) {
        console.error('🔧 OPPORTUNITY FETCHER: CRITICAL ERROR - Opportunity subdomain mismatch!', {
          currentSubdomain: subdomain,
          opportunitySubdomain: currentOpportunity.subdomain,
          opportunityId: currentOpportunity.opportunity_id
        });
        
        // Clear cache and return error
        this.requestManager.clearCacheForSubdomain(subdomain);
        return {
          opportunity: null,
          error: `State correction: wrong opportunity detected`
        };
      }

      // Check cache first
      const cached = this.requestManager.getCachedResult(subdomain);
      if (cached) {
        // Validate cached opportunity
        if (validateOpportunitySubdomain(cached.opportunity, subdomain)) {
          console.log('🔧 OPPORTUNITY FETCHER: Using cached result for:', subdomain);
          return {
            opportunity: cached.opportunity,
            error: cached.error
          };
        } else {
          // Invalid cached data, clear it
          this.requestManager.clearCacheForSubdomain(subdomain);
        }
      }

      // Enqueue request and get abort controller
      const controller = this.requestManager.enqueueRequest(subdomain, requestId, 1);

      // Fetch opportunity data
      const opportunityData = await fetchOpportunityData(subdomain, controller, requestId);

      // Check if request is still valid
      if (!this.requestManager.isRequestValid(requestId)) {
        console.log('🔧 OPPORTUNITY FETCHER: Request cancelled or superseded:', subdomain, 'RequestID:', requestId);
        return { opportunity: null, error: null };
      }

      if (!opportunityData || opportunityData.length === 0) {
        console.log('🔧 OPPORTUNITY FETCHER: No opportunity found for subdomain:', subdomain, 'RequestID:', requestId);
        const errorMsg = `Opportunity not found for subdomain: ${subdomain}`;
        this.requestManager.setCachedResult(subdomain, null, errorMsg);
        return { opportunity: null, error: errorMsg };
      }

      const fetchedOpportunity = opportunityData[0];
      
      // Validate opportunity subdomain before proceeding
      if (!validateFetchedOpportunity(fetchedOpportunity, subdomain, requestId)) {
        const errorMsg = `Data integrity error: fetched opportunity subdomain mismatch`;
        this.requestManager.setCachedResult(subdomain, null, errorMsg);
        return { opportunity: null, error: errorMsg };
      }

      console.log('🔧 OPPORTUNITY FETCHER: Found valid opportunity:', {
        name: fetchedOpportunity.name,
        opportunity_id: fetchedOpportunity.opportunity_id,
        theme_id: fetchedOpportunity.theme_id,
        subdomain: fetchedOpportunity.subdomain,
        user_id: fetchedOpportunity.user_id,
        requestId
      });

      // Fetch theme data
      const theme = await fetchThemeData(fetchedOpportunity.theme_id, controller, requestId);

      // Check if request is still valid after theme fetch
      if (!this.requestManager.isRequestValid(requestId)) {
        console.log('🔧 OPPORTUNITY FETCHER: Theme request cancelled or superseded:', subdomain, 'RequestID:', requestId);
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
          console.log('🔧 OPPORTUNITY FETCHER: Profile request cancelled or superseded:', subdomain, 'RequestID:', requestId);
          return { opportunity: null, error: null };
        }
      } else {
        console.log('🔧 OPPORTUNITY FETCHER: No user_id found, skipping owner profile fetch. RequestID:', requestId);
      }

      // Transform the data to match the expected structure
      console.log('🔧 OPPORTUNITY FETCHER: Transforming data with owner profile:', {
        hasOwnerProfile: !!ownerProfile,
        ownerFullName: ownerProfile?.full_name,
        requestId
      });
      const transformedOpportunity = transformOpportunityData(fetchedOpportunity, theme, requestId, ownerProfile);

      // Final validation before setting state
      if (!validateOpportunityBeforeSet(transformedOpportunity, subdomain, requestId)) {
        const errorMsg = `Final validation failed: opportunity subdomain mismatch`;
        this.requestManager.setCachedResult(subdomain, null, errorMsg);
        return { opportunity: null, error: errorMsg };
      }
      
      console.log('✅ OPPORTUNITY FETCHER: Transformed opportunity successfully:', {
        opportunity_id: transformedOpportunity.opportunity_id,
        theme_id: transformedOpportunity.theme.theme_id,
        subdomain: transformedOpportunity.subdomain,
        theme_name: transformedOpportunity.theme.name,
        user_id: transformedOpportunity.user_id,
        contact_person: transformedOpportunity.contact_person,
        owner_full_name: transformedOpportunity.owner_full_name,
        requestId
      });
      
      // Cache the successful result
      this.requestManager.setCachedResult(subdomain, transformedOpportunity, null);
      
      return { opportunity: transformedOpportunity, error: null };
    } catch (err) {
      // Don't log errors for aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🔧 OPPORTUNITY FETCHER: Request aborted for subdomain:', subdomain, 'RequestID:', requestId);
        return { opportunity: null, error: null };
      }
      
      console.error('❌ OPPORTUNITY FETCHER: Error fetching opportunity config:', err, 'RequestID:', requestId);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load opportunity';
      
      // Cache the error result
      this.requestManager.setCachedResult(subdomain, null, errorMsg);
      return { opportunity: null, error: errorMsg };
    } finally {
      // Clean up the request
      this.requestManager.dequeueRequest(requestId);
    }
  }
}
