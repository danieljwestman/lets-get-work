
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
  
  // Only fetch opportunities for subdomains and custom domains, not main domains
  const shouldFetchOpportunity = domainInfo && !domainInfo.isMainDomain;
  const profileId = shouldFetchOpportunity ? domainInfo.profileId : null;
  
  const { opportunity, isLoading, error } = useOpportunityConfig(profileId);

  // Enhanced logging with validation
  console.log('🔧 OPPORTUNITY CONTEXT: Provider render:', {
    domainType: domainInfo?.type,
    isMainDomain: domainInfo?.isMainDomain,
    shouldFetchOpportunity,
    profileId,
    hasOpportunity: !!opportunity,
    opportunityId: opportunity?.opportunity_id,
    opportunityProfileId: opportunity?.profile_id,
    themeId: opportunity?.theme?.theme_id,
    isLoading,
    error,
    profileIdMatch: opportunity ? opportunity.profile_id === profileId : 'N/A'
  });

  // Validation check - ensure opportunity matches profile ID (only for subdomains)
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
