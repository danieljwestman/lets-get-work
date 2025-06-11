import React from 'react';
import { BarChart3, Mail, Palette, Briefcase, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MobileNavigationProps {
  currentValue: string;
  onNavigate: (value: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentValue, onNavigate }) => {
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  const handleNavigate = (value: string) => {
    onNavigate(value);
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 p-0 hover:bg-gray-100"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Navigation Items with top margin */}
            <div className="flex-1 pt-16 px-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentValue === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full justify-start gap-3 h-12 px-4 text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                LetsGetWork Dashboard
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
