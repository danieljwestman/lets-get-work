
import { OpportunityWithTheme } from '@/types/opportunity';

export const validateOpportunityProfile = (
  opportunity: OpportunityWithTheme | null, 
  expectedProfileId: string
): boolean => {
  if (!opportunity) return true; // null is valid
  const isValid = opportunity.profile_id === expectedProfileId;
  if (!isValid) {
    console.error('🔧 OPPORTUNITY VALIDATION: Profile ID mismatch!', {
      opportunityProfileId: opportunity.profile_id,
      expectedProfileId,
      opportunityId: opportunity.opportunity_id
    });
  }
  return isValid;
};

export const validateFetchedOpportunity = (
  opportunity: any,
  profileId: string,
  requestId: string
): boolean => {
  if (opportunity.profile_id !== profileId) {
    console.error('🔧 OPPORTUNITY VALIDATION: Critical error - fetched opportunity has wrong profile ID!', {
      expectedProfileId: profileId,
      actualProfileId: opportunity.profile_id,
      opportunityId: opportunity.opportunity_id,
      requestId
    });
    return false;
  }
  return true;
};

export const validateOpportunityBeforeSet = (
  opportunity: OpportunityWithTheme,
  profileId: string,
  requestId: string
): boolean => {
  if (!validateOpportunityProfile(opportunity, profileId)) {
    console.error('🔧 OPPORTUNITY VALIDATION: Final validation failed:', {
      opportunityProfileId: opportunity.profile_id,
      expectedProfileId: profileId,
      requestId
    });
    return false;
  }
  return true;
};
