
import React from 'react';
import { Bug, AlertTriangle, Shield } from 'lucide-react';
import { getDebugConfig } from './config';

interface DebugBadgeProps {
  securityWarnings: string[];
  truncatedText: string | null;
  onToggle: () => void;
}

export const DebugBadge: React.FC<DebugBadgeProps> = ({
  securityWarnings,
  truncatedText,
  onToggle
}) => {
  const config = getDebugConfig();

  return (
    <div className="flex-shrink-0">
      <button
        onClick={onToggle}
        className={`${
          securityWarnings.length > 0 
            ? 'bg-red-500/90 hover:bg-red-500' 
            : 'bg-orange-500/90 hover:bg-orange-500'
        } text-white px-3 py-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-${config.UI.ANIMATION_DURATION} hover:scale-105 flex items-center gap-2 text-sm font-medium`}
        title="Toggle Debug Panel (Ctrl+Shift+D)"
      >
        {securityWarnings.length > 0 ? (
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        ) : (
          <Bug className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="flex-shrink-0">Debug</span>
        {securityWarnings.length > 0 && (
          <Shield className="w-4 h-4 flex-shrink-0 animate-pulse" />
        )}
      </button>
    </div>
  );
};
