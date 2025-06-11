
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubNavigationItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SubNavigationProps {
  items: SubNavigationItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const SubNavigation: React.FC<SubNavigationProps> = ({
  items,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-1 py-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
