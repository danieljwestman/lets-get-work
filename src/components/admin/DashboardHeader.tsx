import React from 'react';
import { BarChart3, Mail, Palette, Briefcase, LayoutDashboard } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardNotificationCenter } from '@/components/notifications/DashboardNotificationCenter';
import { DashboardUserMenu } from '@/components/shared/DashboardUserMenu';
import { MobileNavigation } from './MobileNavigation';

interface DashboardHeaderProps {
  onLogout: () => void;
  currentValue?: string;
  onNavigate?: (value: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onLogout, 
  currentValue = 'analytics',
  onNavigate = () => {}
}) => {
  console.log('DashboardHeader: Rendering header component');
  
  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'profile', label: 'Profile', icon: LayoutDashboard },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            {/* Hide text on mobile, show on sm and larger */}
            <h1 className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LetsGetWork
            </h1>
          </div>
          
          {/* Right side - Desktop Navigation, Notifications, Mobile Nav, and User Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop Navigation - moved to right side */}
            <div className="hidden md:flex items-center">
              <TabsList className="bg-transparent h-auto p-0 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border data-[state=active]:border-blue-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 bg-transparent"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Notifications - using dashboard variant */}
            <DashboardNotificationCenter />
            
            {/* User Menu - using shared component for both mobile and desktop */}
            <DashboardUserMenu />
            
            {/* Mobile Navigation - Far right */}
            <MobileNavigation currentValue={currentValue} onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </header>
  );
};
