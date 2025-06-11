
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationProps {
  entityName: string;
  entityType: string;
  onConfirm: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  entityName,
  entityType,
  onConfirm,
  isLoading = false,
  children
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {entityType}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{entityName}"? This action cannot be undone
            {entityType === 'Theme' && ' and may affect opportunities using this theme'}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
