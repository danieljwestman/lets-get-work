
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Chrome, Lock } from 'lucide-react';

interface Theme {
  id?: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding?: any;
  content?: any;
  danibot?: any;
}

interface ThemeBasicInfoProps {
  theme: Theme | null;
  onChange: (updates: Partial<Theme>) => void;
}

export const ThemeBasicInfo: React.FC<ThemeBasicInfoProps> = ({ 
  theme, 
  onChange 
}) => {
  if (!theme) return null;

  const isDefaultTheme = theme.theme_id === 'default';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme_id" className="flex items-center gap-2">
                Theme ID
                {isDefaultTheme && <Lock className="h-3 w-3 text-gray-400" />}
              </Label>
              <Input
                id="theme_id"
                value={theme.theme_id}
                onChange={(e) => onChange({ theme_id: e.target.value })}
                placeholder="e.g., default"
                className="font-mono"
                disabled={isDefaultTheme}
              />
              <p className="text-xs text-gray-500">
                {isDefaultTheme 
                  ? "Default theme ID cannot be changed"
                  : "Unique identifier for the theme (lowercase, no spaces)"
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Theme Name</Label>
              <Input
                id="name"
                value={theme.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="e.g., Default Theme"
              />
              <p className="text-xs text-gray-500">
                Display name for the theme
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="browser_title" className="flex items-center gap-2">
              <Chrome className="h-4 w-4" />
              Browser Title
            </Label>
            <Input
              id="browser_title"
              value={theme.browser_title || ''}
              onChange={(e) => onChange({ browser_title: e.target.value })}
              placeholder="e.g., Daniel Westman - Professional Resume"
            />
            <p className="text-xs text-gray-500">
              The title that appears in the browser tab. If empty, defaults to theme name.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
