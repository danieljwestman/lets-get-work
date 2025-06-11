
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Palette } from 'lucide-react';
import { LazyThemeEditor } from './shared/LazyComponents';
import { ThemesList } from './shared/ThemesList';
import { useThemesData } from './hooks/useThemesData';
import { MemoizedLoadingState, MemoizedErrorState } from './shared/MemoizedComponents';

export const ThemesManager: React.FC = () => {
  const { themes, loading, error, refreshThemes, copyTheme, copying } = useThemesData();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleBack = useCallback(() => {
    setSelectedTheme(null);
    setIsCreating(false);
    refreshThemes();
  }, [refreshThemes]);

  const handleCreateNew = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleEdit = useCallback((themeId: string) => {
    setSelectedTheme(themeId);
  }, []);

  const handleCopy = useCallback(async (theme: any) => {
    await copyTheme(theme);
  }, [copyTheme]);

  if (loading) {
    return <MemoizedLoadingState message="Loading themes..." />;
  }

  if (error) {
    return <MemoizedErrorState error={error} onRetry={refreshThemes} />;
  }

  if (selectedTheme || isCreating) {
    return (
      <LazyThemeEditor
        themeId={selectedTheme}
        onBack={handleBack}
        isCreating={isCreating}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Themes Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage theme configurations, branding, content templates, and translations
            </p>
          </div>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Theme
        </Button>
      </div>

      <ThemesList 
        themes={themes}
        onEdit={handleEdit}
        onRefresh={refreshThemes}
        onCreate={handleCreateNew}
        onCopy={handleCopy}
        copying={copying}
      />
    </div>
  );
};
