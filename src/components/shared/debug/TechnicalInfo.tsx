
import React from 'react';
import { Monitor, Smartphone, Tablet, Laptop } from 'lucide-react';
import { DebugInfo } from './types';
import { useResponsive } from '@/hooks/useResponsive';

interface TechnicalInfoProps {
  debugInfo: DebugInfo;
}

export const TechnicalInfo: React.FC<TechnicalInfoProps> = ({ debugInfo }) => {
  const responsive = useResponsive();
  
  const getBreakpointIcon = () => {
    if (responsive.isMobile) return <Smartphone className="w-4 h-4" />;
    if (responsive.isTablet) return <Tablet className="w-4 h-4" />;
    if (responsive.isDesktop) return <Laptop className="w-4 h-4" />;
    if (responsive.isWide) return <Monitor className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const getBreakpointName = () => {
    if (responsive.isMobile) return 'Mobile';
    if (responsive.isTablet) return 'Tablet';
    if (responsive.isDesktop) return 'Desktop';
    if (responsive.isWide) return 'Wide';
    return 'Unknown';
  };

  const getBreakpointColor = () => {
    if (responsive.isMobile) return 'text-blue-600 bg-blue-100';
    if (responsive.isTablet) return 'text-green-600 bg-green-100';
    if (responsive.isDesktop) return 'text-purple-600 bg-purple-100';
    if (responsive.isWide) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  const orientation = responsive.width > responsive.height ? 'Landscape' : 'Portrait';
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  return (
    <div className="p-4">
      <div className="space-y-3 text-sm">
        {/* Current Breakpoint */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
          <span className="text-gray-600 font-medium">Breakpoint:</span>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getBreakpointColor()}`}>
              {getBreakpointIcon()}
              {getBreakpointName()}
            </div>
          </div>
        </div>

        {/* Viewport Details */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
          <span className="text-gray-600 font-medium">Viewport:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
            {debugInfo.viewport}
          </code>
        </div>

        {/* Orientation & Pixel Ratio */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
          <span className="text-gray-600 font-medium">Display:</span>
          <div className="flex gap-2">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
              {orientation}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
              {pixelRatio}x DPR
            </span>
          </div>
        </div>

        {/* Responsive State Details */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
          <span className="text-gray-600 font-medium">States:</span>
          <div className="flex flex-wrap gap-1">
            {responsive.isMobile && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Mobile</span>
            )}
            {responsive.isTablet && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Tablet</span>
            )}
            {responsive.isDesktop && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Desktop</span>
            )}
            {responsive.isWide && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Wide</span>
            )}
          </div>
        </div>
        
        {/* Browser Info */}
        <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
          <span className="text-gray-600 font-medium">Browser:</span>
          <span className="text-gray-800 text-xs break-words">
            {debugInfo.userAgent}
          </span>
        </div>
      </div>
    </div>
  );
};
