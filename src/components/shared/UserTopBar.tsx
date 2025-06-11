import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Lock, CircleCheck, CircleMinus, CircleX } from 'lucide-react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { PresentationUserMenu } from '@/components/shared/PresentationUserMenu';

interface UserTopBarProps {
  onDashboardClick: () => void;
}

export const UserTopBar: React.FC<UserTopBarProps> = ({ onDashboardClick }) => {
  const { opportunity } = useOpportunity();

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

  const StatusIcon = getStatusIcon(opportunity.status);

  return (
    <div className="hidden md:block fixed top-6 right-6 z-30 pointer-events-none">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 pointer-events-auto">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            {/* Status Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-full border border-gray-100 bg-white ${getStatusColor(opportunity.status)}`}
                >
                  <StatusIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Status: {getStatusLabel(opportunity.status)}</p>
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
