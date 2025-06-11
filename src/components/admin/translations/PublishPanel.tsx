
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Globe, Download, Database, Info } from 'lucide-react';
import { exportTranslationsForReference, downloadTranslationReference } from '@/utils/exportTranslations';
import { Translation } from '@/types/admin';

interface PublishPanelProps {
  translations: Record<string, Translation[]>;
  companyId: string;
  onPublishSuccess: () => void;
}

export const PublishPanel: React.FC<PublishPanelProps> = ({
  translations,
  companyId,
  onPublishSuccess
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Count unpublished translations (those with draft_value)
  const unpublishedCount = Object.values(translations).flat().filter(t => t.draft_value).length;
  const totalCount = Object.values(translations).flat().length;

  const handlePublishAll = async () => {
    if (unpublishedCount === 0) {
      toast({
        title: "No changes to publish",
        description: "All translations are already published.",
      });
      return;
    }

    setIsPublishing(true);
    try {
      console.log('🔧 PUBLISH PANEL: Starting publish all process');
      const allTranslations = Object.values(translations).flat();
      const unpublishedTranslations = allTranslations.filter(t => t.draft_value);

      console.log('🔧 PUBLISH PANEL: Found unpublished translations:', unpublishedTranslations.length);

      const updatePromises = unpublishedTranslations.map(async (translation) => {
        console.log('🔧 PUBLISH PANEL: Publishing translation:', translation.translation_key, translation.draft_value);
        return supabase
          .from('translations')
          .update({
            published_value: translation.draft_value,
            draft_value: null // Clear draft after publishing
          })
          .eq('id', translation.id);
      });

      const results = await Promise.all(updatePromises);
      
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        const errors = results.filter(r => r.error).map(r => r.error);
        console.error('🔧 PUBLISH PANEL: Publish errors:', errors);
        throw new Error('Failed to publish some translations');
      }

      console.log('🔧 PUBLISH PANEL: All translations published successfully');

      toast({
        title: "Translations published",
        description: `${unpublishedTranslations.length} translations published successfully. Changes are live immediately.`,
        variant: "success",
      });

      onPublishSuccess();
    } catch (error) {
      console.error('🔧 PUBLISH PANEL: Error publishing translations:', error);
      toast({
        title: "Error",
        description: "Failed to publish translations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExportReference = async () => {
    setIsExporting(true);
    try {
      const result = await exportTranslationsForReference(companyId);
      
      if (result.success && result.exportData) {
        // Download each language file
        Object.entries(result.exportData).forEach(([language, data]) => {
          downloadTranslationReference(companyId, language, data);
        });

        toast({
          title: "Reference export completed",
          description: `Downloaded ${Object.keys(result.exportData).length} language files for reference.`,
          variant: "success",
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting reference:', error);
      toast({
        title: "Export failed",
        description: "Failed to export translations for reference.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Database-Only Translation System</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-blue-100 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="text-xs space-y-1">
              <li>• All translations are stored in the database and loaded in real-time</li>
              <li>• Changes take effect immediately when published</li>
              <li>• JSON files in the codebase are seed data only (not used at runtime)</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <Badge className="bg-orange-100 text-orange-800 border-orange-300 font-medium">
                {unpublishedCount} unpublished
              </Badge>
              <span className="text-gray-600 ml-2">
                {totalCount} total translations
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleExportReference}
              disabled={isExporting || totalCount === 0}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Reference'}
            </Button>

            <Button
              onClick={handlePublishAll}
              disabled={isPublishing || unpublishedCount === 0}
              size="sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              {isPublishing ? 'Publishing...' : `Publish All (${unpublishedCount})`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
