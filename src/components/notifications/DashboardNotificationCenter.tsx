
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDropdownContent } from '@/components/shared/NotificationDropdownContent';
import { useIsMobile } from '@/hooks/use-mobile';

export const DashboardNotificationCenter: React.FC = () => {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center p-0 min-w-4"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isMobile ? "center" : "end"}
        className="p-0 border-0"
        sideOffset={12}
      >
        <NotificationDropdownContent onClose={() => setIsOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
