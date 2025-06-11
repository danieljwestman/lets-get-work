
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, AlertCircle, Info, AlertTriangle, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications, type Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'message':
        return <Mail className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    if (notification.is_read) return 'bg-white';
    
    switch (notification.type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'message':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div 
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${getBgColor()}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                {notification.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
