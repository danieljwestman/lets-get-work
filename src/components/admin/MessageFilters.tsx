
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { INQUIRY_TYPES } from '@/constants/inquiryTypes';
import { MESSAGE_SOURCES } from '@/constants/messageSources';

interface MessageFiltersProps {
  sourceFilter: string;
  inquiryFilter: string;
  searchTerm: string;
  onSourceFilterChange: (value: string) => void;
  onInquiryFilterChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
  onClearFilters: () => void;
}

export const MessageFilters: React.FC<MessageFiltersProps> = ({
  sourceFilter,
  inquiryFilter,
  searchTerm,
  onSourceFilterChange,
  onInquiryFilterChange,
  onSearchTermChange,
  onClearFilters
}) => {
  const hasActiveFilters = sourceFilter !== 'all' || inquiryFilter !== 'all' || searchTerm;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[150px]">
          <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {MESSAGE_SOURCES.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select value={inquiryFilter} onValueChange={onInquiryFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {INQUIRY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
