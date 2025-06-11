
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddTranslationFormProps {
  newKey: string;
  newValue: string;
  activeLanguage: 'en' | 'sv';
  onKeyChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onAdd: () => void;
}

export const AddTranslationForm: React.FC<AddTranslationFormProps> = ({
  newKey,
  newValue,
  activeLanguage,
  onKeyChange,
  onValueChange,
  onAdd
}) => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Add New Translation</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="newKey">Translation Key</Label>
              <Input
                id="newKey"
                value={newKey}
                onChange={(e) => onKeyChange(e.target.value)}
                placeholder="e.g., hero.title"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newValue">Translation Value</Label>
              <Input
                id="newValue"
                value={newValue}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder="Translation text..."
              />
            </div>
          </div>
          <Button onClick={onAdd} disabled={!newKey || !newValue} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Translation ({activeLanguage.toUpperCase()})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
