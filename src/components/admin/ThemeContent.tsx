
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileText, Eye, Settings } from 'lucide-react';

interface Theme {
  id?: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding?: any;
  content?: any;
  danibot?: any;
}

interface ThemeContentProps {
  theme: Theme | null;
  onChange: (updates: Partial<Theme>) => void;
}

export const ThemeContent: React.FC<ThemeContentProps> = ({ 
  theme, 
  onChange 
}) => {
  if (!theme) return null;

  const updateContent = (contentUpdates: any) => {
    onChange({
      content: { ...theme.content, ...contentUpdates }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                value={theme.content?.targetRole || ''}
                onChange={(e) => updateContent({ targetRole: e.target.value })}
                placeholder="e.g., Customer Success Specialist"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={theme.content?.industry || ''}
                onChange={(e) => updateContent({ industry: e.target.value })}
                placeholder="e.g., Technology/SaaS"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySpecificSkills">Company-Specific Skills (comma-separated)</Label>
            <Textarea
              id="companySpecificSkills"
              value={theme.content?.companySpecificSkills?.join(', ') || ''}
              onChange={(e) => updateContent({ 
                companySpecificSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              })}
              placeholder="e.g., Customer Success, Technical Support, SaaS Platforms"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Display Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Show Hero CTAs</Label>
              <p className="text-sm text-gray-500">Display call-to-action buttons in the hero section</p>
            </div>
            <Switch
              checked={theme.content?.showHeroCTAs ?? true}
              onCheckedChange={(checked) => updateContent({ showHeroCTAs: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Custom CTAs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryCTA">Primary CTA Text</Label>
              <Input
                id="primaryCTA"
                value={theme.content?.customCTA?.primary || ''}
                onChange={(e) => updateContent({ 
                  customCTA: { 
                    ...theme.content?.customCTA, 
                    primary: e.target.value 
                  }
                })}
                placeholder="e.g., Join Our Team"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryCTA">Secondary CTA Text</Label>
              <Input
                id="secondaryCTA"
                value={theme.content?.customCTA?.secondary || ''}
                onChange={(e) => updateContent({ 
                  customCTA: { 
                    ...theme.content?.customCTA, 
                    secondary: e.target.value 
                  }
                })}
                placeholder="e.g., Chat with DaniBot"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
