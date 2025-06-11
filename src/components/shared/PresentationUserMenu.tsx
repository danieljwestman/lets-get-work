
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { UserMenuDropdownContent } from '@/components/shared/UserMenuDropdownContent';

export const PresentationUserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
          <UserAvatar size="sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="p-0 border-0"
        sideOffset={12}
      >
        <UserMenuDropdownContent onClose={() => setIsOpen(false)} isDashboard={false} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
