
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { OpportunityStatusType } from '@/constants/opportunityStatuses';

interface Opportunity {
  id: string;
  opportunity_id: string;
  name: string;
  theme_id: string;
  company_name?: string;
  contact_person?: string;
  target_role?: string;
  notes?: string;
  status: OpportunityStatusType;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useOpportunitiesData = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    if (!user) {
      setOpportunities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('opportunities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Transform and validate the data
      const transformedData: Opportunity[] = (data || []).map(item => ({
        ...item,
        status: (item.status === 'unpublished' || item.status === 'published' || item.status === 'archived') 
          ? item.status as OpportunityStatusType
          : 'unpublished' // Default fallback
      }));

      setOpportunities(transformedData);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  const generateUniqueOpportunityId = async (baseId: string): Promise<string> => {
    let proposedOpportunityId = `${baseId}-copy`;
    let counter = 1;

    while (true) {
      const { data, error } = await supabase
        .from('opportunities')
        .select('opportunity_id')
        .eq('user_id', user!.id)
        .eq('opportunity_id', proposedOpportunityId);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        // No conflicts found, ID is unique
        return proposedOpportunityId;
      }

      // If we found conflicts, try the next increment
      counter++;
      proposedOpportunityId = `${baseId}-copy${counter}`;
    }
  };

  const copyOpportunity = async (originalOpportunity: Opportunity) => {
    if (!user) return;

    try {
      setCopying(originalOpportunity.opportunity_id);

      // Generate unique opportunity_id
      const opportunityId = await generateUniqueOpportunityId(originalOpportunity.opportunity_id);

      // Create the new opportunity
      const newOpportunity = {
        opportunity_id: opportunityId,
        name: `${originalOpportunity.name} Copy`,
        theme_id: originalOpportunity.theme_id,
        company_name: originalOpportunity.company_name,
        contact_person: originalOpportunity.contact_person,
        target_role: originalOpportunity.target_role,
        notes: originalOpportunity.notes,
        status: originalOpportunity.status,
        user_id: user.id
      };

      const { error: insertError } = await supabase
        .from('opportunities')
        .insert(newOpportunity);

      if (insertError) {
        throw insertError;
      }

      // Refresh opportunities list
      await fetchOpportunities();

      return opportunityId;
    } catch (err) {
      console.error('Error copying opportunity:', err);
      throw err;
    } finally {
      setCopying(null);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [user]);

  return {
    opportunities,
    loading,
    error,
    copying,
    refreshOpportunities: fetchOpportunities,
    copyOpportunity
  };
};
