
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Languages, Save, Edit3, Trash2, Upload } from 'lucide-react';
import { TranslationStatusBadge } from './TranslationStatusBadge';
import { Translation } from '@/types/admin';

interface TranslationsListProps {
  translations: Translation[];
  language: 'en' | 'sv';
  onSave: (language: 'en' | 'sv', key: string, value: string) => Promise<void>;
  onDelete: (language: 'en' | 'sv', key: string) => Promise<void>;
  onPublishSingle?: (language: 'en' | 'sv', key: string) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

export const TranslationsList: React.FC<TranslationsListProps> = ({
  translations,
  language,
  onSave,
  onDelete,
  onPublishSingle,
  loading,
  saving
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const saveEdit = async () => {
    if (editingKey) {
      await onSave(language, editingKey, editValue);
      setEditingKey(null);
      setEditValue('');
    }
  };

  const handlePublishSingle = async (key: string) => {
    if (onPublishSingle) {
      await onPublishSingle(language, key);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading translations...</p>
      </div>
    );
  }

  if (translations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Languages className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>No translations found</p>
        <p className="text-sm">Add your first translation above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {translations.map((translation) => {
        const hasDraft = Boolean(translation.draft_value);
        const hasPublished = Boolean(translation.published_value);
        const currentValue = translation.draft_value || translation.published_value || '';
        
        let borderClass = 'border-l-4 border-l-green-500'; // Published
        if (hasDraft) {
          borderClass = 'border-l-4 border-l-orange-500'; // Has draft
        } else if (!hasPublished) {
          borderClass = 'border-l-4 border-l-yellow-500'; // Empty
        }

        return (
          <Card key={translation.translation_key} className={borderClass}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {translation.translation_key}
                    </Badge>
                    <TranslationStatusBadge translation={translation} />
                  </div>
                  
                  {editingKey === translation.translation_key ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex gap-2">
                        <Button onClick={saveEdit} size="sm" disabled={saving}>
                          <Save className="h-3 w-3 mr-1" />
                          Save Draft
                        </Button>
                        <Button 
                          onClick={() => setEditingKey(null)} 
                          variant="outline" 
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 leading-relaxed">
                        {currentValue || <span className="text-gray-400 italic">No content</span>}
                      </p>
                      {translation.updated_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(translation.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {editingKey !== translation.translation_key && (
                  <div className="flex gap-1">
                    {hasDraft && (
                      <Button
                        onClick={() => handlePublishSingle(translation.translation_key)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Upload className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      onClick={() => startEditing(translation.translation_key, currentValue)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => onDelete(language, translation.translation_key)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
