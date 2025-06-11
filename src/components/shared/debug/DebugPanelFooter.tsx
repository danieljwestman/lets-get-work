
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface DebugPanelFooterProps {
  onToggle: () => void;
}

export const DebugPanelFooter: React.FC<DebugPanelFooterProps> = ({ onToggle }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
      <div className="text-xs text-gray-500">
        Ctrl+Shift+D: Toggle
      </div>
      <button
        onClick={onToggle}
        className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-xs"
      >
        <ChevronDown className="w-3 h-3" />
        <span>Minimize</span>
      </button>
    </div>
  );
};
