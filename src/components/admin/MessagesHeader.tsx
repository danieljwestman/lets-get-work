
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Filter, Mail } from 'lucide-react';
import type { OpportunityOption } from './services/opportunityFilterService';

interface MessagesHeaderProps {
  onRefresh: () => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  companyFilter: string;
  setCompanyFilter: (filter: string) => void;
  opportunities: OpportunityOption[];
  timezone: string;
}

export const MessagesHeader: React.FC<MessagesHeaderProps> = ({ 
  onRefresh,
  timeRange,
  setTimeRange,
  companyFilter,
  setCompanyFilter,
  opportunities,
  timezone
}) => {
  const timeRanges = [
    { value: '1h', label: '1h' },
    { value: '1d', label: '1d' },
    { value: '30d', label: '30d' },
    { value: '1y', label: '1y' },
    { value: 'all', label: 'All' }
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
      {/* Header with icon - Left side */}
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track all incoming messages and inquiries</p>
        </div>
      </div>

      {/* Filters - Right side */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Opportunity Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-48 h-9 px-3">
              <SelectValue placeholder="All Opportunities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Opportunities</SelectItem>
              {opportunities.map((opportunity) => (
                <SelectItem key={opportunity.value} value={opportunity.value}>
                  {opportunity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Range Badges */}
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <Badge
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Badge>
          ))}
        </div>

        {/* Refresh Button */}
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
