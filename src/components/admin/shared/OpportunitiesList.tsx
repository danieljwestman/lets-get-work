
import React, { useState, useEffect } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { EmptyState } from './EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Opportunity } from '@/types/admin';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  onEdit: (opportunityId: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onCopy?: (opportunity: Opportunity) => Promise<void>;
  copying?: string | null;
}

export const OpportunitiesList: React.FC<OpportunitiesListProps> = ({
  opportunities,
  onEdit,
  onRefresh,
  onCreate,
  onCopy,
  copying
}) => {
  const { user } = useAuth();
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Fetch view counts for all opportunities
  useEffect(() => {
    const fetchViewCounts = async () => {
      if (!user || opportunities.length === 0) return;

      try {
        const opportunityIds = opportunities.map(opp => opp.opportunity_id);
        
        const { data: analyticsData, error } = await supabase
          .from('analytics_events')
          .select('opportunity_id')
          .eq('event_type', 'page_view')
          .in('opportunity_id', opportunityIds);

        if (error) {
          console.error('Error fetching analytics data:', error);
          return;
        }

        // Count views per opportunity
        const counts: Record<string, number> = {};
        analyticsData?.forEach(event => {
          counts[event.opportunity_id] = (counts[event.opportunity_id] || 0) + 1;
        });

        setViewCounts(counts);
      } catch (error) {
        console.error('Error fetching view counts:', error);
      }
    };

    fetchViewCounts();
  }, [user, opportunities]);

  if (opportunities.length === 0) {
    return (
      <EmptyState
        title="No opportunities yet"
        description="Create your first opportunity to start tracking your outreach campaigns."
        actionLabel="Add Opportunity"
        onAction={onCreate}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.opportunity_id}
          opportunity={opportunity}
          onEdit={() => onEdit(opportunity.opportunity_id)}
          onRefresh={onRefresh}
          onCopy={onCopy}
          copying={copying === opportunity.opportunity_id}
          viewCount={viewCounts[opportunity.opportunity_id] || 0}
        />
      ))}
    </div>
  );
};
