
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye, Trash2 } from 'lucide-react';
import { format, toZonedTime } from 'date-fns-tz';
import type { Message } from '@/types/admin';

interface MessageTableRowProps {
  message: Message;
  onViewMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  getSourceBadge: (source: string) => React.ReactNode;
  isDeleting: boolean;
  timezone: string;
}

export const MessageTableRow: React.FC<MessageTableRowProps> = ({
  message,
  onViewMessage,
  onDeleteMessage,
  getSourceBadge,
  isDeleting,
  timezone
}) => {
  const formatMessageDate = (dateStr: string, timezone: string): string => {
    const date = new Date(dateStr);
    const zonedDate = toZonedTime(date, timezone);
    
    // Format as "Dec 5, 14:19" for a human-friendly display
    return format(zonedDate, 'MMM d, HH:mm', { timeZone: timezone });
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-sm">
        {formatMessageDate(message.created_at, timezone)}
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{message.sender_name}</div>
          <div className="text-sm text-gray-500">{message.sender_email}</div>
        </div>
      </TableCell>
      <TableCell>{getSourceBadge(message.source)}</TableCell>
      <TableCell>
        <Badge variant="outline">{message.inquiry_type}</Badge>
      </TableCell>
      <TableCell>
        <Badge 
          className={message.email_sent_successfully 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
          }
        >
          {message.email_sent_successfully ? 'Sent' : 'Failed'}
        </Badge>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate">{message.message}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewMessage(message)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isDeleting}
            onClick={() => onDeleteMessage(message.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
