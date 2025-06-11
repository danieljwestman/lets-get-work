
import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageTableRow } from './MessageTableRow';
import { MessageDeleteDialog } from './MessageDeleteDialog';
import { MessageTableEmpty } from './MessageTableEmpty';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Message } from '@/types/admin';

interface MessageTableViewProps {
  messages: Message[];
  onViewMessage: (message: Message) => void;
  getSourceBadge: (source: string) => React.ReactNode;
  onMessageDeleted?: () => void;
  timezone: string;
}

export const MessageTableView: React.FC<MessageTableViewProps> = ({
  messages,
  onViewMessage,
  getSourceBadge,
  onMessageDeleted,
  timezone
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  const handleDeleteClick = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setMessageToDelete(message);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;

    console.log('🗑️ Starting delete process for message:', messageToDelete.id);
    setDeletingId(messageToDelete.id);
    
    try {
      // Check dashboard authentication
      const dashboardAuth = sessionStorage.getItem('dashboard_authenticated');
      
      if (dashboardAuth !== 'true') {
        console.error('❌ Dashboard authentication required');
        toast({
          title: "Authentication Required",
          description: "Please log in to the dashboard to delete messages.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Dashboard user authenticated, proceeding with delete...');
      console.log('📡 Making delete request to Supabase...');
      
      const { error, count } = await supabase
        .from('messages')
        .delete({ count: 'exact' })
        .eq('id', messageToDelete.id);

      if (error) {
        console.error('❌ Supabase delete error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        toast({
          title: "Delete Failed",
          description: `Failed to delete message: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Delete operation completed. Rows affected:', count);
      
      if (count === 0) {
        console.warn('⚠️ No rows were deleted - message may not exist');
        toast({
          title: "Warning",
          description: "Message may have already been deleted.",
          variant: "destructive",
        });
        return;
      }

      console.log('🎉 Message deleted successfully from database');
      toast({
        title: "Success",
        description: "Message deleted successfully.",
      });

      // Call the callback to refresh the messages list
      if (onMessageDeleted) {
        console.log('🔄 Calling onMessageDeleted callback...');
        await onMessageDeleted();
        console.log('✅ onMessageDeleted callback completed');
      } else {
        console.warn('⚠️ No onMessageDeleted callback provided');
      }
    } catch (error: any) {
      console.error('💥 Unexpected error during delete:', error);
      console.error('💥 Full error object:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        cause: error?.cause
      });
      
      toast({
        title: "Unexpected Error", 
        description: `An unexpected error occurred: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      console.log('🏁 Delete process completed, resetting state');
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

  if (messages.length === 0) {
    return <MessageTableEmpty />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <MessageTableRow
                key={message.id}
                message={message}
                onViewMessage={onViewMessage}
                onDeleteMessage={handleDeleteClick}
                getSourceBadge={getSourceBadge}
                isDeleting={deletingId === message.id}
                timezone={timezone}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <MessageDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        senderName={messageToDelete?.sender_name || ''}
        isDeleting={!!deletingId}
      />
    </>
  );
};
