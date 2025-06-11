
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TimezoneSelector } from '../analytics/components/TimezoneSelector';

interface MessagesTimezoneManagerProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export const MessagesTimezoneManager: React.FC<MessagesTimezoneManagerProps> = ({
  timezone,
  onTimezoneChange
}) => {
  return (
    <div className="flex justify-center">
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <TimezoneSelector 
            selectedTimezone={timezone}
            onTimezoneChange={onTimezoneChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
