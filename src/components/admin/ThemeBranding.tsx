
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Paintbrush2 } from 'lucide-react';

interface Theme {
  id?: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding?: any;
  content?: any;
  danibot?: any;
}

interface ThemeBrandingProps {
  theme: Theme | null;
  onChange: (updates: Partial<Theme>) => void;
}

export const ThemeBranding: React.FC<ThemeBrandingProps> = ({ 
  theme, 
  onChange 
}) => {
  if (!theme) return null;

  const updateBranding = (brandingUpdates: any) => {
    onChange({
      branding: { ...theme.branding, ...brandingUpdates }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <Input
                id="primaryColor"
                value={theme.branding?.primaryColor || ''}
                onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                placeholder="e.g., blue-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <Input
                id="secondaryColor"
                value={theme.branding?.secondaryColor || ''}
                onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                placeholder="e.g., purple-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <Input
                id="accentColor"
                value={theme.branding?.accentColor || ''}
                onChange={(e) => updateBranding({ accentColor: e.target.value })}
                placeholder="e.g., green-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush2 className="h-5 w-5" />
            Gradients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroGradient">Hero Gradient</Label>
              <Input
                id="heroGradient"
                value={theme.branding?.gradients?.hero || ''}
                onChange={(e) => updateBranding({ 
                  gradients: { 
                    ...theme.branding?.gradients, 
                    hero: e.target.value 
                  }
                })}
                placeholder="e.g., from-blue-50 via-purple-50 to-pink-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryGradient">Primary Gradient</Label>
              <Input
                id="primaryGradient"
                value={theme.branding?.gradients?.primary || ''}
                onChange={(e) => updateBranding({ 
                  gradients: { 
                    ...theme.branding?.gradients, 
                    primary: e.target.value 
                  }
                })}
                placeholder="e.g., from-blue-600 to-purple-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryGradient">Secondary Gradient</Label>
              <Input
                id="secondaryGradient"
                value={theme.branding?.gradients?.secondary || ''}
                onChange={(e) => updateBranding({ 
                  gradients: { 
                    ...theme.branding?.gradients, 
                    secondary: e.target.value 
                  }
                })}
                placeholder="e.g., from-purple-600 to-pink-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
