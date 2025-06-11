
import React from 'react';
import { Bug, AlertTriangle, Copy, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DebugInfo } from './types';

interface DebugPanelHeaderProps {
  debugInfo: DebugInfo | null;
  securityWarnings: string[];
  onCopyDebugInfo: () => void;
  onClose: () => void;
}

export const DebugPanelHeader: React.FC<DebugPanelHeaderProps> = ({
  debugInfo,
  securityWarnings,
  onCopyDebugInfo,
  onClose
}) => {
  return (
    <div className={`flex items-center justify-between p-4 ${
      securityWarnings.length > 0 
        ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' 
        : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
    } border-b flex-shrink-0`}>
      <div className="flex items-center gap-2">
        {securityWarnings.length > 0 ? (
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        ) : (
          <Bug className="w-5 h-5 text-orange-600 flex-shrink-0" />
        )}
        <span className="font-semibold text-gray-800">Debug Panel</span>
        {securityWarnings.length > 0 && (
          <Badge variant="destructive" className="text-xs flex-shrink-0">
            {securityWarnings.length} WARNING{securityWarnings.length > 1 ? 'S' : ''}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onCopyDebugInfo}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-white/50 flex-shrink-0"
          title="Copy Debug Info (Ctrl+Shift+C)"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-white/50 flex-shrink-0"
          title="Close Debug Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
