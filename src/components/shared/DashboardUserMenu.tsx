
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { UserMenuDropdownContent } from '@/components/shared/UserMenuDropdownContent';
import { useIsMobile } from '@/hooks/use-mobile';

export const DashboardUserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <UserAvatar size="sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isMobile ? "center" : "end"}
        className="p-0 border-0"
        sideOffset={12}
      >
        <UserMenuDropdownContent onClose={() => setIsOpen(false)} isDashboard={true} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
