
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { EmptyStateProps } from '@/types/admin';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Button onClick={onAction} className="flex items-center gap-2">
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
};
