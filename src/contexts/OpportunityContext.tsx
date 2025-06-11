
import React, { createContext, useContext, useMemo } from 'react';
import { OpportunityWithTheme, OpportunityContextType } from '@/types/opportunity';
import { useSubdomain } from '@/hooks/useSubdomain';
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
      subdomain: opportunity.subdomain,
      browserTitle: opportunity.theme.browser_title,
      branding: opportunity.theme.branding,
      content: opportunity.theme.content,
      daniBot: opportunity.theme.danibot
    };
  }, [opportunity]);

  return { company, isLoading, error };
};

export const OpportunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const subdomain = useSubdomain();
  const { opportunity, isLoading, error } = useOpportunityConfig(subdomain);

  // Enhanced logging with validation
  console.log('🔧 OPPORTUNITY CONTEXT: Provider render:', {
    subdomain,
    hasOpportunity: !!opportunity,
    opportunityId: opportunity?.opportunity_id,
    opportunitySubdomain: opportunity?.subdomain,
    themeId: opportunity?.theme?.theme_id,
    isLoading,
    error,
    subdomainMatch: opportunity ? opportunity.subdomain === subdomain : 'N/A'
  });

  // Validation check - ensure opportunity matches subdomain
  if (opportunity && subdomain && opportunity.subdomain !== subdomain) {
    console.error('🔧 OPPORTUNITY CONTEXT: CRITICAL ERROR - Opportunity subdomain mismatch in provider!', {
      currentSubdomain: subdomain,
      opportunitySubdomain: opportunity.subdomain,
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
