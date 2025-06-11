
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseDeleteEntityOptions {
  table: string;
  idColumn: string;
  entityType: string;
  onSuccess?: () => void;
}

export const useDeleteEntity = ({
  table,
  idColumn,
  entityType,
  onSuccess
}: UseDeleteEntityOptions) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const deleteEntity = async (id: string) => {
    setIsDeleting(id);
    
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq(idColumn, id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `${entityType} deleted successfully`,
      });
      
      onSuccess?.();
    } catch (err) {
      console.error(`Error deleting ${entityType.toLowerCase()}:`, err);
      toast({
        title: "Error",
        description: `Failed to delete ${entityType.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    deleteEntity,
    isDeleting
  };
};
