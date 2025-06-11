
import { OpportunityWithTheme } from '@/types/opportunity';

export const validateOpportunitySubdomain = (
  opportunity: OpportunityWithTheme | null, 
  expectedSubdomain: string
): boolean => {
  if (!opportunity) return true; // null is valid
  const isValid = opportunity.subdomain === expectedSubdomain;
  if (!isValid) {
    console.error('🔧 OPPORTUNITY VALIDATION: Subdomain mismatch!', {
      opportunitySubdomain: opportunity.subdomain,
      expectedSubdomain,
      opportunityId: opportunity.opportunity_id
    });
  }
  return isValid;
};

export const validateFetchedOpportunity = (
  opportunity: any,
  subdomain: string,
  requestId: string
): boolean => {
  if (opportunity.subdomain !== subdomain) {
    console.error('🔧 OPPORTUNITY VALIDATION: Critical error - fetched opportunity has wrong subdomain!', {
      expectedSubdomain: subdomain,
      actualSubdomain: opportunity.subdomain,
      opportunityId: opportunity.opportunity_id,
      requestId
    });
    return false;
  }
  return true;
};

export const validateOpportunityBeforeSet = (
  opportunity: OpportunityWithTheme,
  subdomain: string,
  requestId: string
): boolean => {
  if (!validateOpportunitySubdomain(opportunity, subdomain)) {
    console.error('🔧 OPPORTUNITY VALIDATION: Final validation failed:', {
      opportunitySubdomain: opportunity.subdomain,
      expectedSubdomain: subdomain,
      requestId
    });
    return false;
  }
  return true;
};
