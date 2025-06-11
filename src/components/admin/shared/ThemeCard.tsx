
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Edit, Chrome, Shield, Copy } from 'lucide-react';
import { DeleteConfirmation } from './DeleteConfirmation';
import { useDeleteEntity } from '@/hooks/useDeleteEntity';
import { useToast } from '@/hooks/use-toast';

interface Theme {
  id: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding: any;
  content: any;
  danibot: any;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface ThemeCardProps {
  theme: Theme;
  onEdit: () => void;
  onRefresh: () => void;
  onCopy?: (theme: Theme) => Promise<void>;
  copying?: boolean;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  onEdit,
  onRefresh,
  onCopy,
  copying = false
}) => {
  const { toast } = useToast();
  const { deleteEntity, isDeleting } = useDeleteEntity({
    table: 'themes',
    idColumn: 'theme_id',
    entityType: 'Theme',
    onSuccess: onRefresh
  });

  const handleDelete = () => deleteEntity(theme.theme_id);
  const isDefaultTheme = theme.theme_id === 'default';

  const handleCopy = async () => {
    if (!onCopy) return;
    
    try {
      await onCopy(theme);
      toast({
        title: 'Theme copied',
        description: `${theme.name} has been copied successfully.`,
      });
    } catch (error) {
      console.error('Error copying theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy theme. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
              <Palette className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {theme.name}
                {isDefaultTheme && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Protected
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1 font-mono">{theme.theme_id}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Chrome className="h-4 w-4" />
            <span>{theme.browser_title || 'No browser title set'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Palette className="h-4 w-4" />
            <span>Primary: {theme.branding?.primaryColor || 'Not set'}</span>
          </div>
          <div className="flex gap-2 pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="flex-1"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              disabled={copying}
            >
              <Copy className="h-3 w-3" />
            </Button>
            {!isDefaultTheme && (
              <DeleteConfirmation
                entityName={theme.name}
                entityType="Theme"
                onConfirm={handleDelete}
                isLoading={isDeleting === theme.theme_id}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
