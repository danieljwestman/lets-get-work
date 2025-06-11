
import React from 'react';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getOpportunityStatusLabel } from '@/constants/opportunityStatuses';
import { OpportunityDebugInfo } from './types';

interface OpportunityInfoProps {
  opportunityDebugInfo: OpportunityDebugInfo | null;
  opportunityLoading: boolean;
  opportunityError: string | null;
}

export const OpportunityInfo: React.FC<OpportunityInfoProps> = ({
  opportunityDebugInfo,
  opportunityLoading,
  opportunityError
}) => {
  const getStatusBadgeVariant = (status: string): "secondary" | "outline" | "default" | "destructive" => {
    return 'secondary';
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'published': 
        return 'bg-green-50 text-green-600 border-green-200';
      case 'unpublished': 
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'archived': 
        return 'bg-gray-50 text-gray-600 border-gray-200';
      default: 
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="p-4">
      {opportunityDebugInfo ? (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
            <span className="text-gray-600 font-medium">Status:</span>
            <Badge 
              variant={getStatusBadgeVariant(opportunityDebugInfo.status)} 
              className={`text-xs w-fit ${getStatusBadgeClasses(opportunityDebugInfo.status)}`}
            >
              {getOpportunityStatusLabel(opportunityDebugInfo.status).toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
            <span className="text-gray-600 font-medium">ID:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 break-all">
              {opportunityDebugInfo.opportunityId}
            </code>
          </div>

          {opportunityDebugInfo.actualOpportunityId && (
            <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
              <span className="text-gray-600 font-medium">UUID:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 break-all">
                {opportunityDebugInfo.actualOpportunityId}
              </code>
            </div>
          )}

          <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="text-gray-800 text-xs break-words">
              {opportunityDebugInfo.name}
            </span>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
            <span className="text-gray-600 font-medium">Subdomain:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 break-all">
              {opportunityDebugInfo.subdomain}
            </code>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
            <span className="text-gray-600 font-medium">Theme:</span>
            <span className="text-gray-800 text-xs break-words">
              {opportunityDebugInfo.themeName}
            </span>
          </div>

          {opportunityDebugInfo.companyName && (
            <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
              <span className="text-gray-600 font-medium">Company:</span>
              <span className="text-gray-800 text-xs break-words">
                {opportunityDebugInfo.companyName}
              </span>
            </div>
          )}

          {opportunityDebugInfo.targetRole && (
            <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
              <span className="text-gray-600 font-medium">Role:</span>
              <span className="text-gray-800 text-xs break-words">
                {opportunityDebugInfo.targetRole}
              </span>
            </div>
          )}
        </div>
      ) : opportunityLoading ? (
        <div className="text-gray-500 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin flex-shrink-0"></div>
          Loading opportunity...
        </div>
      ) : opportunityError ? (
        <div className="text-red-500 text-sm break-words">
          Error: {opportunityError}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          No opportunity context available
        </div>
      )}
    </div>
  );
};
