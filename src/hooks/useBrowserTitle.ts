
import { useEffect } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useDomainContext } from '@/hooks/useDomainContext';

export const useBrowserTitle = () => {
  const { opportunity } = useOpportunity();
  const domainInfo = useDomainContext();

  useEffect(() => {
    // For main domains, set a default title
    if (domainInfo?.isMainDomain) {
      document.title = 'LetsGetWork - Smart Job Hunting';
      return;
    }

    // For subdomains and custom domains, use opportunity data
    if (opportunity) {
      const title = opportunity.theme.browser_title || opportunity.theme.name || 'My Lovable Job Application';
      document.title = title;
    }
  }, [opportunity, domainInfo?.isMainDomain]);
};
