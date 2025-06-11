
import React from 'react';
import { User, Settings, LogOut, HelpCircle, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuDropdownContentProps {
  onClose: () => void;
  isDashboard?: boolean;
}

export const UserMenuDropdownContent: React.FC<UserMenuDropdownContentProps> = ({ onClose, isDashboard = false }) => {
  const { profile } = useProfile();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleNavigation = (section: string) => {
    if (isDashboard) {
      // In dashboard - trigger tab change via URL hash
      window.location.hash = section;
      // Also dispatch a custom event to ensure the tab change is picked up
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      // From presentation page - navigate to dashboard with specific section
      window.location.href = `/dashboard#${section}`;
    }
    onClose();
  };

  const handleHelpSupport = () => {
    if (isDashboard) {
      // In dashboard - trigger tab change via URL hash
      window.location.hash = 'help-support';
      // Also dispatch a custom event to ensure the tab change is picked up
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      // From presentation page - navigate to dashboard with specific section
      window.location.href = `/dashboard#help-support`;
    }
    onClose();
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      onClick: () => handleNavigation('profile')
    },
    {
      icon: Settings,
      label: 'Settings', 
      onClick: () => handleNavigation('settings')
    },
    {
      icon: CreditCard,
      label: 'Billing',
      onClick: () => handleNavigation('billing')
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onClick: handleHelpSupport
    }
  ];

  return (
    <Card className="border border-gray-200 shadow-lg w-56 sm:w-[calc(100vw-2rem)] md:w-56">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center gap-3">
          <UserAvatar size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.email}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="p-0">
        <div className="py-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
          
          <Separator className="my-2" />
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors focus:outline-none"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
