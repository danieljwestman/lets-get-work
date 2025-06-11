
import { useEffect } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';

export const useBrowserTitle = () => {
  const { opportunity } = useOpportunity();

  useEffect(() => {
    if (opportunity) {
      const title = opportunity.theme.browser_title || opportunity.theme.name || 'My Lovable Job Application';
      document.title = title;
    }
  }, [opportunity]);
};
