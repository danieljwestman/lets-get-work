
import React from 'react';
import { Clock } from 'lucide-react';
import { TIMEZONE_OPTIONS } from '../utils/timezoneUtils';

interface TimezoneIndicatorProps {
  timezone: string;
  className?: string;
  showIcon?: boolean;
}

export const TimezoneIndicator: React.FC<TimezoneIndicatorProps> = ({
  timezone,
  className = "text-xs text-muted-foreground",
  showIcon = true
}) => {
  const timezoneOption = TIMEZONE_OPTIONS.find(tz => tz.value === timezone);
  const abbreviation = timezoneOption?.abbreviation || 'UTC';

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      {showIcon && <Clock className="h-3 w-3" />}
      ({abbreviation})
    </span>
  );
};
