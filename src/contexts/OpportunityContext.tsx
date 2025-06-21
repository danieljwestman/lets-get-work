
import React, { createContext, useContext, useMemo } from 'react';
import { OpportunityWithTheme, OpportunityContextType } from '@/types/opportunity';
import { useDomainContext } from '@/hooks/useDomainContext';
import { useOpportunityConfig } from '@/hooks/useOpportunityConfig';

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

export const useOpportunity = () => {
  const context = useContext(OpportunityContext);
  if (!context) {
    throw new Error('useOpportunity must be used within an OpportunityProvider');
  }
  return context;
};

// Backwards compatibility hook for components still using useCompany
export const useCompany = () => {
  const { opportunity, isLoading, error } = useOpportunity();
  
  // Memoize the company object to prevent unnecessary re-renders
  const company = useMemo(() => {
    if (!opportunity) return null;
    
    return {
      id: opportunity.theme.theme_id,
      name: opportunity.theme.name,
      profileId: opportunity.profile_id,
      browserTitle: opportunity.theme.browser_title,
      branding: opportunity.theme.branding,
      content: opportunity.theme.content,
      daniBot: opportunity.theme.danibot
    };
  }, [opportunity]);

  return { company, isLoading, error };
};

export const OpportunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const domainInfo = useDomainContext();
  
  // Determine if we should fetch opportunities
  let shouldFetchOpportunity = false;
  let profileId: string | null = null;
  let opportunityId: string | null = null;

  if (domainInfo) {
    console.log('🔧 OPPORTUNITY CONTEXT: Processing domain info:', {
      type: domainInfo.type,
      isMainDomain: domainInfo.isMainDomain,
      profileId: domainInfo.profileId,
      opportunityId: domainInfo.opportunityId,
      customDomainData: domainInfo.customDomainData
    });

    // For subdomains and custom domains, fetch opportunities
    if (!domainInfo.isMainDomain) {
      shouldFetchOpportunity = true;
      profileId = domainInfo.profileId || null;
      
      // For custom opportunity domains, use the specific opportunity ID
      // For other domains (subdomains, custom profile domains), use the path-based opportunity ID or default
      if (domainInfo.type === 'custom' && domainInfo.customDomainData?.target_type === 'opportunity') {
        // Custom opportunity domain - use the target_opportunity_id from the domain config
        opportunityId = domainInfo.customDomainData.target_opportunity_id || 'default';
        console.log('🔧 OPPORTUNITY CONTEXT: Custom opportunity domain detected, using opportunity ID:', opportunityId);
      } else {
        // Subdomain or custom profile domain - use the path-based opportunity ID
        opportunityId = domainInfo.opportunityId || 'default';
        console.log('🔧 OPPORTUNITY CONTEXT: Using path-based opportunity ID:', opportunityId);
      }
    }
    // For main domain /profiles/:profileId routes, also fetch opportunities
    else if (domainInfo.type === 'main' && domainInfo.profileId) {
      shouldFetchOpportunity = true;
      profileId = domainInfo.profileId;
      opportunityId = 'default'; // Profile routes always use default opportunity
      console.log('🔧 OPPORTUNITY CONTEXT: Main domain profile route, using default opportunity');
    }
  }
  
  console.log('🔧 OPPORTUNITY CONTEXT: Final fetch parameters:', {
    shouldFetchOpportunity,
    profileId,
    opportunityId
  });

  const { opportunity, isLoading, error } = useOpportunityConfig(
    shouldFetchOpportunity ? profileId : null, 
    shouldFetchOpportunity ? opportunityId : null
  );

  // Enhanced logging with validation
  console.log('🔧 OPPORTUNITY CONTEXT: Provider render:', {
    domainType: domainInfo?.type,
    isMainDomain: domainInfo?.isMainDomain,
    shouldFetchOpportunity,
    profileId,
    opportunityId,
    hasOpportunity: !!opportunity,
    opportunityIdFromOpportunity: opportunity?.opportunity_id,
    opportunityProfileId: opportunity?.profile_id,
    themeId: opportunity?.theme?.theme_id,
    isLoading,
    error,
    profileIdMatch: opportunity ? opportunity.profile_id === profileId : 'N/A',
    customDomainData: domainInfo?.customDomainData
  });

  // Validation check - ensure opportunity matches profile ID
  if (opportunity && profileId && opportunity.profile_id !== profileId) {
    console.error('🔧 OPPORTUNITY CONTEXT: CRITICAL ERROR - Opportunity profile ID mismatch in provider!', {
      currentProfileId: profileId,
      opportunityProfileId: opportunity.profile_id,
      opportunityId: opportunity.opportunity_id
    });
  }

  const contextValue = useMemo(() => ({
    opportunity,
    isLoading,
    error
  }), [opportunity, isLoading, error]);

  return (
    <OpportunityContext.Provider value={contextValue}>
      {children}
    </OpportunityContext.Provider>
  );
};
