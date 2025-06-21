
import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityRequestManager } from './OpportunityRequestManager';
import { validateOpportunityBeforeSet } from './opportunityValidation';
import { transformOpportunityData } from './opportunityDataTransformer';
import { fetchOpportunityByUserId, fetchThemeData, fetchOwnerProfile } from './opportunityDataService';

export interface OpportunityFetchResult {
  opportunity: OpportunityWithTheme | null;
  error: string | null;
}

export class OpportunityDirectFetcher {
  private requestManager: OpportunityRequestManager;

  constructor(requestManager: OpportunityRequestManager) {
    this.requestManager = requestManager;
  }

  async fetchOpportunityConfig(
    userId: string,
    opportunityId: string,
    requestId: string,
    currentOpportunity: OpportunityWithTheme | null
  ): Promise<OpportunityFetchResult> {
    try {
      console.log('🔧 OPPORTUNITY DIRECT FETCHER: Starting fetch for user ID:', userId, 'Opportunity ID:', opportunityId, 'RequestID:', requestId);

      // Check cache first (using combined key)
      const cacheKey = `${userId}-${opportunityId}`;
      const cached = this.requestManager.getCachedResult(cacheKey);
      if (cached) {
        console.log('🔧 OPPORTUNITY DIRECT FETCHER: Using cached result for:', cacheKey);
        return {
          opportunity: cached.opportunity,
          error: cached.error
        };
      }

      // Enqueue request and get abort controller
      const controller = this.requestManager.enqueueRequest(cacheKey, requestId, 1);

      // Fetch by user_id and opportunity_id
      console.log('🔧 OPPORTUNITY DIRECT FETCHER: Fetching by user ID:', userId, 'and opportunity ID:', opportunityId);
      const opportunityData = await fetchOpportunityByUserId(userId, opportunityId, controller, requestId);

      // Check if request is still valid
      if (!this.requestManager.isRequestValid(requestId)) {
        console.log('🔧 OPPORTUNITY DIRECT FETCHER: Request cancelled or superseded:', userId, 'RequestID:', requestId);
        return { opportunity: null, error: null };
      }

      if (!opportunityData || opportunityData.length === 0) {
        console.log('🔧 OPPORTUNITY DIRECT FETCHER: No opportunity found for user ID:', userId, 'and opportunity ID:', opportunityId, 'RequestID:', requestId);
        const errorMsg = `Opportunity not found: ${opportunityId}`;
        this.requestManager.setCachedResult(cacheKey, null, errorMsg);
        return { opportunity: null, error: errorMsg };
      }

      const fetchedOpportunity = opportunityData[0];
      
      console.log('🔧 OPPORTUNITY DIRECT FETCHER: Found valid opportunity:', {
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
        console.log('🔧 OPPORTUNITY DIRECT FETCHER: Theme request cancelled or superseded:', userId, 'RequestID:', requestId);
        return { opportunity: null, error: null };
      }

      // Fetch owner profile if user_id exists
      let ownerProfile = null;
      if (fetchedOpportunity.user_id) {
        console.log('🔧 OPPORTUNITY DIRECT FETCHER: Attempting to fetch owner profile for user_id:', fetchedOpportunity.user_id, 'RequestID:', requestId);
        ownerProfile = await fetchOwnerProfile(fetchedOpportunity.user_id, controller, requestId);
        console.log('🔧 OPPORTUNITY DIRECT FETCHER: Owner profile fetch result:', {
          ownerProfile,
          hasFullName: !!ownerProfile?.full_name,
          fullName: ownerProfile?.full_name,
          requestId
        });
        
        // Check if request is still valid after profile fetch
        if (!this.requestManager.isRequestValid(requestId)) {
          console.log('🔧 OPPORTUNITY DIRECT FETCHER: Profile request cancelled or superseded:', userId, 'RequestID:', requestId);
          return { opportunity: null, error: null };
        }
      } else {
        console.log('🔧 OPPORTUNITY DIRECT FETCHER: No user_id found, skipping owner profile fetch. RequestID:', requestId);
      }

      // Transform the data to match the expected structure
      console.log('🔧 OPPORTUNITY DIRECT FETCHER: Transforming data with owner profile:', {
        hasOwnerProfile: !!ownerProfile,
        ownerFullName: ownerProfile?.full_name,
        requestId
      });
      const transformedOpportunity = transformOpportunityData(fetchedOpportunity, theme, requestId, ownerProfile);

      console.log('✅ OPPORTUNITY DIRECT FETCHER: Transformed opportunity successfully:', {
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
      // Don't log errors for aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🔧 OPPORTUNITY DIRECT FETCHER: Request aborted for user ID:', userId, 'RequestID:', requestId);
        return { opportunity: null, error: null };
      }
      
      console.error('❌ OPPORTUNITY DIRECT FETCHER: Error fetching opportunity config:', err, 'RequestID:', requestId);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load opportunity';
      
      // Cache the error result
      const cacheKey = `${userId}-${opportunityId}`;
      this.requestManager.setCachedResult(cacheKey, null, errorMsg);
      return { opportunity: null, error: errorMsg };
    } finally {
      // Clean up the request
      this.requestManager.dequeueRequest(requestId);
    }
  }
}
