
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OpportunityOption {
  value: string;
  label: string;
}

export const fetchUserOpportunities = async (userId: string): Promise<OpportunityOption[]> => {
  console.log('opportunityFilterService: Fetching opportunities for user:', userId);
  
  const { data: opportunitiesData, error: opportunitiesError } = await supabase
    .from('opportunities')
    .select('opportunity_id, name')
    .eq('user_id', userId)
    .order('name');

  if (opportunitiesError) {
    console.error('opportunityFilterService: Error fetching opportunities:', opportunitiesError);
    throw opportunitiesError;
  }

  const opportunities: OpportunityOption[] = (opportunitiesData || []).map(opp => ({
    value: opp.opportunity_id,
    label: opp.name
  }));

  console.log('opportunityFilterService: Found opportunities:', opportunities);
  
  return opportunities;
};

export const useOpportunityOptions = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = React.useState<OpportunityOption[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOpportunities = async () => {
      if (!user) {
        setOpportunities([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const options = await fetchUserOpportunities(user.id);
        setOpportunities(options);
      } catch (error) {
        console.error('useOpportunityOptions: Error fetching opportunities:', error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [user]);

  return { opportunities, loading };
};
