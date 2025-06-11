import React, { useMemo, useCallback } from 'react';
import { Target, Bot, Palette, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MemoizedEmptyState, MemoizedThemeCard } from './MemoizedComponents';

// Use the same Theme interface that MemoizedComponents expects
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

interface ThemesListProps {
  themes: Theme[];
  onEdit: (themeId: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onCopy?: (theme: Theme) => Promise<void>;
  copying?: string | null;
}

export const ThemesList: React.FC<ThemesListProps> = React.memo(({
  themes,
  onEdit,
  onRefresh,
  onCreate,
  onCopy,
  copying
}) => {
  const stats = useMemo(() => [
    {
      title: "Total Themes",
      value: themes.length,
      icon: Palette,
      iconColor: "text-blue-600",
      borderColor: "border-l-blue-500",
      textColor: "text-blue-900",
      subtitleColor: "text-blue-600"
    },
    {
      title: "AI Personalities",
      value: themes.filter(t => t.danibot && t.danibot.personality).length,
      icon: Bot,
      iconColor: "text-purple-600",
      borderColor: "border-l-purple-500",
      textColor: "text-purple-900",
      subtitleColor: "text-purple-600"
    },
    {
      title: "Custom Brands",
      value: themes.filter(t => t.branding && Object.keys(t.branding).length > 0).length,
      icon: Palette,
      iconColor: "text-green-600",
      borderColor: "border-l-green-500",
      textColor: "text-green-900",
      subtitleColor: "text-green-600"
    },
    {
      title: "With Translations",
      value: themes.length,
      icon: Languages,
      iconColor: "text-orange-600",
      borderColor: "border-l-orange-500",
      textColor: "text-orange-900",
      subtitleColor: "text-orange-600"
    }
  ], [themes]);

  const handleEdit = useCallback((themeId: string) => {
    onEdit(themeId);
  }, [onEdit]);

  if (themes.length === 0) {
    return (
      <>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`${stat.borderColor} border-l-4 bg-white`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${stat.subtitleColor}`}>
                      {stat.title}
                    </div>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <MemoizedEmptyState
          icon={Palette}
          title="No themes yet"
          description="Create your first theme to start managing resume configurations and translations."
          actionLabel="Add Your First Theme"
          onAction={onCreate}
        />
      </>
    );
  }

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${stat.borderColor} border-l-4 bg-white`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`text-sm font-medium ${stat.subtitleColor}`}>
                    {stat.title}
                  </div>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <MemoizedThemeCard
            key={theme.theme_id}
            theme={theme}
            onEdit={() => handleEdit(theme.theme_id)}
            onRefresh={onRefresh}
            onCopy={onCopy}
            copying={copying}
          />
        ))}
      </div>
    </>
  );
});

ThemesList.displayName = 'ThemesList';
