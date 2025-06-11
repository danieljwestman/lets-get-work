
import React from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/notifications/NotificationItem';

interface NotificationDropdownContentProps {
  onClose: () => void;
}

export const NotificationDropdownContent: React.FC<NotificationDropdownContentProps> = ({ onClose }) => {
  const { notifications, loading, unreadCount, markAllAsRead } = useNotifications();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <Card className="border border-gray-200 shadow-lg w-80 sm:w-[calc(100vw-2rem)] md:w-80">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs h-8 px-3"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs mt-1">We'll notify you when something happens</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
