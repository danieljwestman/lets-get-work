
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, Minus } from 'lucide-react';
import { Translation } from '@/types/admin';

interface TranslationStatusBadgeProps {
  translation?: Translation;
  size?: 'sm' | 'md';
}

export const TranslationStatusBadge: React.FC<TranslationStatusBadgeProps> = ({
  translation,
  size = 'sm'
}) => {
  if (!translation) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-600 border-gray-200">
        <Minus className="h-3 w-3" />
        Missing
      </Badge>
    );
  }

  const hasPublished = translation.published_value;
  const hasDraft = translation.draft_value;

  if (hasDraft) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1 bg-orange-100 text-orange-800 border-orange-300 font-medium">
        <AlertCircle className="h-3 w-3" />
        Draft
      </Badge>
    );
  }

  if (hasPublished) {
    return (
      <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300 font-medium">
        <CheckCircle className="h-3 w-3" />
        Published
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-200">
      <Clock className="h-3 w-3" />
      Empty
    </Badge>
  );
};
