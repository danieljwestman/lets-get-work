
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase } from 'lucide-react';
import { LazyOpportunityEditor } from './shared/LazyComponents';
import { OpportunitiesList } from './shared/OpportunitiesList';
import { useOpportunitiesData } from './hooks/useOpportunitiesData';
import { MemoizedLoadingState, MemoizedErrorState } from './shared/MemoizedComponents';

export const OpportunitiesManager: React.FC = () => {
  const { opportunities, loading, error, refreshOpportunities, copyOpportunity, copying } = useOpportunitiesData();
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleBack = useCallback(() => {
    setSelectedOpportunity(null);
    setIsCreating(false);
    refreshOpportunities();
  }, [refreshOpportunities]);

  const handleCreateNew = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleEdit = useCallback((opportunityId: string) => {
    setSelectedOpportunity(opportunityId);
  }, []);

  const handleCopy = useCallback(async (opportunity: any) => {
    await copyOpportunity(opportunity);
  }, [copyOpportunity]);

  if (loading) {
    return <MemoizedLoadingState message="Loading opportunities..." />;
  }

  if (error) {
    return <MemoizedErrorState error={error} onRetry={refreshOpportunities} />;
  }

  if (selectedOpportunity || isCreating) {
    return (
      <LazyOpportunityEditor
        opportunityId={selectedOpportunity}
        onBack={handleBack}
        isCreating={isCreating}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Opportunities Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage individual outreach campaigns and tracking links
            </p>
          </div>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Opportunity
        </Button>
      </div>

      <OpportunitiesList 
        opportunities={opportunities}
        onEdit={handleEdit}
        onRefresh={refreshOpportunities}
        onCreate={handleCreateNew}
        onCopy={handleCopy}
        copying={copying}
      />
    </div>
  );
};
