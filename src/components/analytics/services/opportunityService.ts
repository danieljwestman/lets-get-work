
import { supabase } from '@/integrations/supabase/client';

export const fetchUserOpportunities = async (userId: string): Promise<string[]> => {
  console.log('opportunityService: Fetching opportunities for user:', userId);
  
  const { data: opportunitiesData, error: opportunitiesError } = await supabase
    .from('opportunities')
    .select('opportunity_id')
    .eq('user_id', userId);

  if (opportunitiesError) {
    console.error('opportunityService: Error fetching opportunities:', opportunitiesError);
    throw opportunitiesError;
  }

  const opportunities = opportunitiesData?.map(opp => opp.opportunity_id).sort() || [];
  console.log('opportunityService: Found opportunities:', opportunities);
  
  return opportunities;
};
