
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { CurrentTimeDisplay } from './CurrentTimeDisplay';
import { TIMEZONE_OPTIONS, type TimezoneOption } from '../utils/timezoneUtils';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  selectedTimezone,
  onTimezoneChange
}) => {
  const selectedOption = TIMEZONE_OPTIONS.find(tz => tz.value === selectedTimezone) || TIMEZONE_OPTIONS[0];

  return (
    <div className="flex flex-col items-center gap-2 text-sm">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-gray-500" />
        <Select value={selectedTimezone} onValueChange={onTimezoneChange}>
          <SelectTrigger className="w-40 h-8 px-2 text-xs">
            <SelectValue>
              <span className="flex items-center gap-1">
                {selectedOption.label}
                <span className="text-gray-500">({selectedOption.abbreviation})</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TIMEZONE_OPTIONS.map((timezone) => (
              <SelectItem key={timezone.value} value={timezone.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{timezone.label}</span>
                  <span className="text-gray-500 text-xs ml-2">{timezone.abbreviation}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <CurrentTimeDisplay timezone={selectedTimezone} />
    </div>
  );
};
