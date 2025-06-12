
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Lock, CircleCheck, CircleMinus, CircleX } from 'lucide-react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { PresentationUserMenu } from '@/components/shared/PresentationUserMenu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserTopBarProps {
  onDashboardClick: () => void;
}

export const UserTopBar: React.FC<UserTopBarProps> = ({ onDashboardClick }) => {
  const { opportunity } = useOpportunity();
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  if (!opportunity) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return CircleCheck;
      case 'unpublished':
        return CircleMinus;
      case 'archived':
        return CircleX;
      default:
        return CircleCheck;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 hover:bg-green-50';
      case 'unpublished':
        return 'text-yellow-600 hover:bg-yellow-50';
      case 'archived':
        return 'text-gray-600 hover:bg-gray-50';
      default:
        return 'text-blue-600 hover:bg-blue-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'unpublished':
        return 'Unpublished';
      case 'archived':
        return 'Archived';
      default:
        return 'Status';
    }
  };

  const handleStatusToggle = async () => {
    if (isToggling || opportunity.status === 'archived') return;

    const newStatus = opportunity.status === 'published' ? 'unpublished' : 'published';
    
    setIsToggling(true);
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: newStatus })
        .eq('opportunity_id', opportunity.opportunity_id);

      if (error) {
        throw error;
      }

      toast({
        title: "Status Updated",
        description: `Opportunity ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
      });

      // Reload the page to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update opportunity status",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const getTooltipText = () => {
    if (opportunity.status === 'archived') {
      return `Status: ${getStatusLabel(opportunity.status)}`;
    }
    const currentStatus = getStatusLabel(opportunity.status);
    const nextStatus = opportunity.status === 'published' ? 'Unpublished' : 'Published';
    return `Status: ${currentStatus} - Click to make ${nextStatus}`;
  };

  const StatusIcon = getStatusIcon(opportunity.status);

  return (
    <div className="hidden md:block fixed top-6 right-6 z-30 pointer-events-none">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 pointer-events-auto">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            {/* Status Icon - now clickable */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStatusToggle}
                  disabled={isToggling || opportunity.status === 'archived'}
                  className={`h-8 w-8 p-0 rounded-full border border-gray-100 bg-white ${getStatusColor(opportunity.status)} ${
                    opportunity.status !== 'archived' ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-default'
                  }`}
                >
                  <StatusIcon className={`h-5 w-5 ${isToggling ? 'animate-pulse' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipText()}</p>
              </TooltipContent>
            </Tooltip>

            {/* Lock Icon (if protected) */}
            {opportunity.is_passcode_protected && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full border border-gray-100 bg-white text-amber-600 hover:bg-amber-50"
                  >
                    <Lock className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Protected with Passcode</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Dashboard Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDashboardClick}
                  className="h-8 w-8 p-0 rounded-full border border-gray-100 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>
            
            {/* User Menu */}
            <PresentationUserMenu />
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};
