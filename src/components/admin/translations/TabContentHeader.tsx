
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TabContentHeaderProps {
  title: string;
  description: string;
  publishedCount: number;
  draftCount: number;
}

export const TabContentHeader: React.FC<TabContentHeaderProps> = ({
  title,
  description,
  publishedCount,
  draftCount
}) => {
  const formatDraftText = (count: number) => {
    return count === 1 ? `${count} draft` : `${count} drafts`;
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {publishedCount} published
        </Badge>
        {draftCount > 0 && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {formatDraftText(draftCount)}
          </Badge>
        )}
      </div>
    </div>
  );
};
