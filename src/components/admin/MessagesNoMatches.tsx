
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export const MessagesNoMatches: React.FC = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
        <p className="text-gray-500">No messages found matching your current filters.</p>
      </CardContent>
    </Card>
  );
};
