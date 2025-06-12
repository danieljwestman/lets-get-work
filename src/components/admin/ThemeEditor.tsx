
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { ThemeBasicInfo } from './ThemeBasicInfo';
import { ThemeBranding } from './ThemeBranding';
import { ThemeContent } from './ThemeContent';
import { ThemeDaniBot } from './ThemeDaniBot';
import { LazyThemeTranslations } from './shared/LazyComponents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useThemeEditor } from './hooks/useThemeEditor';
import { MemoizedLoadingState, MemoizedErrorState } from './shared/MemoizedComponents';

interface ThemeEditorProps {
  themeId?: string | null;
  onBack: () => void;
  isCreating?: boolean;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ 
  themeId, 
  onBack, 
  isCreating = false 
}) => {
  const {
    theme,
    loading,
    error,
    updateTheme,
    saveTheme,
    isSaving
  } = useThemeEditor(themeId);

  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = useCallback(async () => {
    const success = await saveTheme();
    if (success) {
      onBack();
    }
  }, [saveTheme, onBack]);

  if (loading) {
    return <MemoizedLoadingState message="Loading theme..." />;
  }

  if (error) {
    return <MemoizedErrorState error={error} onRetry={onBack} retryLabel="Go Back" />;
  }

  const themeName = theme?.name || 'New Theme';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isCreating ? 'Create Theme' : `Edit ${themeName}`}
            </h1>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <TabsList className="w-full h-auto p-1 bg-gray-50/50 grid grid-cols-5 gap-1 rounded-lg">
            <TabsTrigger 
              value="basic"
              className="flex flex-col items-center gap-1 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border border-gray-200 rounded-md transition-all text-sm font-medium"
            >
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger 
              value="branding"
              className="flex flex-col items-center gap-1 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border border-gray-200 rounded-md transition-all text-sm font-medium"
            >
              <span>Branding</span>
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className="flex flex-col items-center gap-1 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border border-gray-200 rounded-md transition-all text-sm font-medium"
            >
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger 
              value="danibot"
              className="flex flex-col items-center gap-1 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border border-gray-200 rounded-md transition-all text-sm font-medium"
            >
              <span>DaniBot</span>
            </TabsTrigger>
            <TabsTrigger 
              value="translations"
              className="flex flex-col items-center gap-1 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border border-gray-200 rounded-md transition-all text-sm font-medium"
            >
              <span>Translations</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="bg-white">
          <TabsContent value="basic" className="mt-0">
            <ThemeBasicInfo theme={theme} onChange={updateTheme} />
          </TabsContent>

          <TabsContent value="branding" className="mt-0">
            <ThemeBranding theme={theme} onChange={updateTheme} />
          </TabsContent>

          <TabsContent value="content" className="mt-0">
            <ThemeContent theme={theme} onChange={updateTheme} />
          </TabsContent>

          <TabsContent value="danibot" className="mt-0">
            <ThemeDaniBot theme={theme} onChange={updateTheme} />
          </TabsContent>

          <TabsContent value="translations" className="mt-0">
            {!isCreating && themeId ? (
              <LazyThemeTranslations themeId={themeId} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">
                    Save the theme first to manage translations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
