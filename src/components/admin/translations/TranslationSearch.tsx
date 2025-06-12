
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface TranslationSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TranslationSearch: React.FC<TranslationSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search translations..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchTerm && (
        <Button
          onClick={handleClear}
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-400" />
        </Button>
      )}
    </div>
  );
};
