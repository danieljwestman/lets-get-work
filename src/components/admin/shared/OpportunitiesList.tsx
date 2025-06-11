
import React, { useMemo, useCallback } from 'react';
import { Target, Building2, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MemoizedEmptyState, MemoizedOpportunityCard } from './MemoizedComponents';
import type { Opportunity } from '@/types/admin';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  onEdit: (opportunityId: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onCopy?: (opportunity: Opportunity) => Promise<void>;
  copying?: string | null;
}

export const OpportunitiesList: React.FC<OpportunitiesListProps> = React.memo(({
  opportunities,
  onEdit,
  onRefresh,
  onCreate,
  onCopy,
  copying
}) => {
  const { publishedOpportunities, unpublishedOpportunities, archivedOpportunities, stats } = useMemo(() => {
    const published = opportunities.filter(o => o.status === 'published');
    const unpublished = opportunities.filter(o => o.status === 'unpublished');
    const archived = opportunities.filter(o => o.status === 'archived');
    
    return {
      publishedOpportunities: published,
      unpublishedOpportunities: unpublished,
      archivedOpportunities: archived,
      stats: [
        {
          title: "Total Opportunities",
          value: opportunities.length,
          icon: Target,
          iconColor: "text-blue-600",
          borderColor: "border-l-blue-500",
          textColor: "text-blue-900",
          subtitleColor: "text-blue-600"
        },
        {
          title: "Published",
          value: published.length,
          icon: Building2,
          iconColor: "text-green-600",
          borderColor: "border-l-green-500",
          textColor: "text-green-900",
          subtitleColor: "text-green-600"
        },
        {
          title: "Unpublished",
          value: unpublished.length,
          icon: Globe,
          iconColor: "text-yellow-600",
          borderColor: "border-l-yellow-500",
          textColor: "text-yellow-900",
          subtitleColor: "text-yellow-600"
        },
        {
          title: "Unique Domains",
          value: opportunities.filter(o => o.subdomain !== 'default').length,
          icon: Globe,
          iconColor: "text-purple-600",
          borderColor: "border-l-purple-500",
          textColor: "text-purple-900",
          subtitleColor: "text-purple-600"
        }
      ]
    };
  }, [opportunities]);

  const handleEdit = useCallback((opportunityId: string) => {
    onEdit(opportunityId);
  }, [onEdit]);

  if (opportunities.length === 0) {
    return (
      <>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`${stat.borderColor} border-l-4 bg-white`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${stat.subtitleColor}`}>
                      {stat.title}
                    </div>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <MemoizedEmptyState
          icon={Target}
          title="No opportunities yet"
          description="Create your first opportunity to start tracking outreach campaigns."
          actionLabel="Add Your First Opportunity"
          onAction={onCreate}
        />
      </>
    );
  }

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${stat.borderColor} border-l-4 bg-white`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`text-sm font-medium ${stat.subtitleColor}`}>
                    {stat.title}
                  </div>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <MemoizedOpportunityCard
            key={opportunity.opportunity_id}
            opportunity={opportunity}
            onEdit={() => handleEdit(opportunity.opportunity_id)}
            onRefresh={onRefresh}
            onCopy={onCopy}
            copying={copying}
          />
        ))}
      </div>
    </>
  );
});

OpportunitiesList.displayName = 'OpportunitiesList';
