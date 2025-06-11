
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { format, toZonedTime } from 'date-fns-tz';
import { TIMEZONE_OPTIONS } from '../utils/timezoneUtils';

interface CurrentTimeDisplayProps {
  timezone: string;
  className?: string;
  showIcon?: boolean;
}

export const CurrentTimeDisplay: React.FC<CurrentTimeDisplayProps> = ({
  timezone,
  className = "text-xs text-muted-foreground",
  showIcon = true
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const zonedTime = toZonedTime(now, timezone);
      const formattedTime = format(zonedTime, 'MMM dd, yyyy HH:mm', { timeZone: timezone });
      setCurrentTime(formattedTime);
    };

    // Update immediately
    updateTime();

    // Update every minute
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [timezone]);

  const timezoneOption = TIMEZONE_OPTIONS.find(tz => tz.value === timezone);
  const abbreviation = timezoneOption?.abbreviation || 'UTC';

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      {showIcon && <Clock className="h-3 w-3" />}
      {currentTime} ({abbreviation})
    </span>
  );
};
