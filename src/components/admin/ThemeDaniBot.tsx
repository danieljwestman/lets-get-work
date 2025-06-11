
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Brain, Smile } from 'lucide-react';

interface Theme {
  id?: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding?: any;
  content?: any;
  danibot?: any;
}

interface ThemeDaniBotProps {
  theme: Theme | null;
  onChange: (updates: Partial<Theme>) => void;
}

export const ThemeDaniBot: React.FC<ThemeDaniBotProps> = ({ 
  theme, 
  onChange 
}) => {
  if (!theme) return null;

  const updateDaniBot = (daniBotUpdates: any) => {
    onChange({
      danibot: { ...theme.danibot, ...daniBotUpdates }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Personality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personality">Personality Type</Label>
            <Select
              value={theme.danibot?.personality || 'professional'}
              onValueChange={(value) => updateDaniBot({ personality: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select personality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="knowledgeBase">Knowledge Base</Label>
            <Input
              id="knowledgeBase"
              value={theme.danibot?.knowledgeBase || ''}
              onChange={(e) => updateDaniBot({ knowledgeBase: e.target.value })}
              placeholder="e.g., general, company-focused, technical"
            />
            <p className="text-xs text-gray-500">
              Defines the scope of knowledge the AI should focus on
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            Custom Greeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customGreeting">Greeting Message</Label>
            <Textarea
              id="customGreeting"
              value={theme.danibot?.customGreeting || ''}
              onChange={(e) => updateDaniBot({ customGreeting: e.target.value })}
              placeholder="Hello! 👋 I'm DaniBot, Daniel's personal AI assistant..."
              rows={4}
            />
            <p className="text-xs text-gray-500">
              This message will be shown when users first interact with the AI assistant
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personality Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">
              <strong>Current Configuration:</strong>
            </div>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Personality:</span> {theme.danibot?.personality || 'professional'}
              </div>
              <div>
                <span className="font-medium">Knowledge Base:</span> {theme.danibot?.knowledgeBase || 'general'}
              </div>
              {theme.danibot?.customGreeting && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <span className="font-medium">Greeting Preview:</span>
                  <p className="mt-1 text-gray-700">{theme.danibot.customGreeting}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
