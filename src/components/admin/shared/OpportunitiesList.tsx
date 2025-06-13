
import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
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
        
        console.log('🔍 Fetching view counts for opportunity IDs:', opportunityIds);
        
        // First, let's check what opportunity_id values actually exist in analytics_events
        const { data: allAnalyticsData, error: allError } = await supabase
          .from('analytics_events')
          .select('opportunity_id, event_type, user_id')
          .eq('event_type', 'page_view')
          .eq('user_id', user.id)
          .not('opportunity_id', 'is', null);

        if (allError) {
          console.error('❌ Error fetching all analytics data:', allError);
          return;
        }

        console.log('📊 All analytics data for user:', allAnalyticsData);
        console.log('📊 Unique opportunity IDs in analytics:', [...new Set(allAnalyticsData?.map(e => e.opportunity_id) || [])]);

        // Now fetch analytics data for the specific opportunities
        const { data: analyticsData, error } = await supabase
          .from('analytics_events')
          .select('opportunity_id')
          .eq('event_type', 'page_view')
          .eq('user_id', user.id)
          .in('opportunity_id', opportunityIds);

        if (error) {
          console.error('❌ Error fetching analytics data:', error);
          return;
        }

        console.log('📊 Filtered analytics data:', analyticsData);

        // Count views per opportunity
        const counts: Record<string, number> = {};
        
        // Initialize all opportunity IDs with 0 counts
        opportunityIds.forEach(id => {
          counts[id] = 0;
        });
        
        // Count actual page views
        analyticsData?.forEach(event => {
          if (event.opportunity_id && opportunityIds.includes(event.opportunity_id)) {
            counts[event.opportunity_id] = (counts[event.opportunity_id] || 0) + 1;
          }
        });

        console.log('📈 Calculated view counts:', counts);
        console.log('📈 Total analytics events found:', analyticsData?.length || 0);
        setViewCounts(counts);
      } catch (error) {
        console.error('❌ Error fetching view counts:', error);
      }
    };

    fetchViewCounts();
  }, [user, opportunities]);

  if (opportunities.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
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
