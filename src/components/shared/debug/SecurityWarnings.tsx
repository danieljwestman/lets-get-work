
import React from 'react';
import { Shield } from 'lucide-react';

interface SecurityWarningsProps {
  warnings: string[];
}

export const SecurityWarnings: React.FC<SecurityWarningsProps> = ({ warnings }) => {
  if (warnings.length === 0) return null;

  return (
    <div className="p-4 bg-red-50 border-b border-red-200">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-red-600" />
        <span className="font-medium text-red-800">Security Warnings</span>
      </div>
      {warnings.map((warning, index) => (
        <div key={index} className="text-sm text-red-700 mb-1">
          • {warning}
        </div>
      ))}
    </div>
  );
};
