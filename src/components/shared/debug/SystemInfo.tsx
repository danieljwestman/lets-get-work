
import React from 'react';
import { DebugInfo } from './types';

interface SystemInfoProps {
  debugInfo: DebugInfo;
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ debugInfo }) => {
  const currentDomain = window.location.hostname;
  const currentFullDomain = window.location.host; // includes port if present

  return (
    <div className="p-4">
      <div className="space-y-3 text-sm">
        {/* Environment Badge - moved to top */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
          <span className="text-gray-600 font-medium">Environment:</span>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            debugInfo.environment === 'dev' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {debugInfo.environment.toUpperCase()}
          </span>
        </div>

        {/* Main Domain (from ENV) */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
          <span className="text-gray-600 font-medium">Main Domain:</span>
          <span className="text-gray-800 text-xs break-all">
            {debugInfo.mainDomain}
          </span>
        </div>

        {/* Current Domain */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
          <span className="text-gray-600 font-medium">Current:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 break-all">
            {currentFullDomain}
          </code>
        </div>
        
        {/* Path (Route) */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
          <span className="text-gray-600 font-medium">Path:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 break-all">
            {debugInfo.currentRoute || '/'}
          </code>
        </div>
      </div>
    </div>
  );
};
