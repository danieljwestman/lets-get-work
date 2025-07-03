
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Target, Palette, Edit, Eye, Copy, Lock, BarChart3, Printer } from 'lucide-react';
import { DeleteConfirmation } from './DeleteConfirmation';
import { useDeleteEntity } from '@/hooks/useDeleteEntity';
import { useToast } from '@/hooks/use-toast';
import { domainConfig } from '@/services/domainConfig';
import type { Opportunity } from '@/types/admin';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onEdit: () => void;
  onRefresh: () => void;
  onCopy?: (opportunity: Opportunity) => Promise<void>;
  copying?: boolean;
  viewCount?: number;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onEdit,
  onRefresh,
  onCopy,
  copying = false,
  viewCount = 0
}) => {
  const { toast } = useToast();
  const { deleteEntity, isDeleting } = useDeleteEntity({
    table: 'opportunities',
    idColumn: 'opportunity_id',
    entityType: 'Opportunity',
    onSuccess: onRefresh
  });

  const handleDelete = () => deleteEntity(opportunity.opportunity_id);
  const isDefaultOpportunity = opportunity.opportunity_id === 'default';

  const handleView = async () => {
    // For now, we'll just show that preview functionality will be implemented later
    toast({
      title: 'Preview',
      description: 'Opportunity preview will be available once profile routing is fully configured.',
    });
  };

  const handleCopy = async () => {
    if (!onCopy) return;
    
    try {
      await onCopy(opportunity);
      toast({
        title: 'Opportunity copied',
        description: `${opportunity.name} has been copied successfully.`,
      });
    } catch (error) {
      console.error('Error copying opportunity:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy opportunity. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePrintView = () => {
    // Navigate to print view - we need to get the user's profile_id
    // For now, we'll use a placeholder - this should be passed from parent or fetched
    const profileId = 'daniel'; // This should come from the user's profile
    window.open(`/opportunities/${profileId}/${opportunity.opportunity_id}/print`, '_blank');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'unpublished':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {opportunity.name}
              {opportunity.is_passcode_protected && (
                <Lock className="h-4 w-4 text-amber-600" />
              )}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 font-mono">{opportunity.opportunity_id}</p>
          </div>
          <Badge 
            variant={getStatusBadgeVariant(opportunity.status)}
            className="text-xs"
          >
            {opportunity.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4" />
            <span>{opportunity.company_name || 'No company name set'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="h-4 w-4" />
            <span>{opportunity.target_role || 'General role'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Palette className="h-4 w-4" />
            <span>Theme: {opportunity.theme_id}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 className="h-4 w-4" />
            <span>Number of views: {viewCount.toLocaleString()}</span>
          </div>
          <div className="flex gap-2 pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="flex-1"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrintView}
              title="Print Resume"
            >
              <Printer className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleView}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              disabled={copying}
            >
              <Copy className="h-3 w-3" />
            </Button>
            {!isDefaultOpportunity && (
              <DeleteConfirmation
                entityName={opportunity.name}
                entityType="Opportunity"
                onConfirm={handleDelete}
                isLoading={isDeleting === opportunity.opportunity_id}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
