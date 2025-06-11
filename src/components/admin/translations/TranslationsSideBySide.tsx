
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Languages, Save, Edit3, Trash2, X, Upload, Plus } from 'lucide-react';
import { TranslationStatusBadge } from './TranslationStatusBadge';
import { Translation } from '@/types/admin';

interface TranslationsSideBySideProps {
  translations: Record<string, Translation[]>;
  filteredTranslations: Translation[];
  onSave: (language: 'en' | 'sv', key: string, value: string) => Promise<void>;
  onDelete: (language: 'en' | 'sv', key: string) => Promise<void>;
  onPublishSingle?: (language: 'en' | 'sv', key: string) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

export const TranslationsSideBySide: React.FC<TranslationsSideBySideProps> = ({
  translations,
  filteredTranslations,
  onSave,
  onDelete,
  onPublishSingle,
  loading,
  saving
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<'en' | 'sv' | null>(null);
  const [editValue, setEditValue] = useState('');

  // Get all unique keys from both languages, considering the search filter
  const getFilteredKeys = () => {
    const filteredKeys = new Set(filteredTranslations.map(t => t.translation_key));
    return Array.from(filteredKeys);
  };

  const getTranslationForKey = (key: string, language: 'en' | 'sv') => {
    return translations[language].find(t => t.translation_key === key);
  };

  const startEditing = (key: string, language: 'en' | 'sv', value: string) => {
    setEditingKey(key);
    setEditingLanguage(language);
    setEditValue(value);
  };

  const saveEdit = async () => {
    if (editingKey && editingLanguage) {
      await onSave(editingLanguage, editingKey, editValue);
      setEditingKey(null);
      setEditingLanguage(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditingLanguage(null);
    setEditValue('');
  };

  const handlePublishSingle = async (language: 'en' | 'sv', key: string) => {
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

  const filteredKeys = getFilteredKeys();

  if (filteredKeys.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Languages className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>No translations found</p>
        <p className="text-sm">Add your first translation above</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Translation Key</TableHead>
            <TableHead className="w-3/8">English</TableHead>
            <TableHead className="w-3/8">Svenska</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredKeys.map((key) => {
            const enTranslation = getTranslationForKey(key, 'en');
            const svTranslation = getTranslationForKey(key, 'sv');
            const isEditing = editingKey === key;

            // Determine left border color based on status
            const getRowClassName = () => {
              const enDraft = enTranslation?.draft_value;
              const svDraft = svTranslation?.draft_value;

              if (enDraft || svDraft) {
                return 'border-l-4 border-l-orange-400';
              }
              return 'border-l-4 border-l-green-400';
            };

            return (
              <TableRow key={key} className={getRowClassName()}>
                <TableCell className="font-mono text-xs align-top">
                  <div className="space-y-2">
                    <Badge variant="outline" className="break-all">
                      {key}
                    </Badge>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="w-4">🇬🇧</span>
                        <TranslationStatusBadge translation={enTranslation} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="w-4">🇸🇪</span>
                        <TranslationStatusBadge translation={svTranslation} />
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="align-top">
                  {isEditing && editingLanguage === 'en' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={3}
                        className="resize-none text-sm"
                      />
                      <div className="flex gap-1">
                        <Button onClick={saveEdit} size="sm" disabled={saving}>
                          <Save className="h-3 w-3 mr-1" />
                          Save Draft
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" size="sm">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : enTranslation ? (
                    <div className="group relative">
                      <p className="text-sm text-gray-700 leading-relaxed min-h-[1.5rem] pr-16">
                        {(enTranslation.draft_value || enTranslation.published_value)}
                      </p>
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white border border-gray-200 rounded-md shadow-sm flex">
                          <Button
                            onClick={() => startEditing(key, 'en', enTranslation.draft_value || enTranslation.published_value || '')}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-none rounded-l-md border-r"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          {enTranslation.draft_value && (
                            <Button
                              onClick={() => handlePublishSingle('en', key)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-none border-r text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Upload className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            onClick={() => onDelete('en', key)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-none rounded-r-md text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4">
                      <Button
                        onClick={() => startEditing(key, 'en', '')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add English
                      </Button>
                    </div>
                  )}
                </TableCell>

                <TableCell className="align-top">
                  {isEditing && editingLanguage === 'sv' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={3}
                        className="resize-none text-sm"
                      />
                      <div className="flex gap-1">
                        <Button onClick={saveEdit} size="sm" disabled={saving}>
                          <Save className="h-3 w-3 mr-1" />
                          Save Draft
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" size="sm">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : svTranslation ? (
                    <div className="group relative">
                      <p className="text-sm text-gray-700 leading-relaxed min-h-[1.5rem] pr-16">
                        {(svTranslation.draft_value || svTranslation.published_value)}
                      </p>
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white border border-gray-200 rounded-md shadow-sm flex">
                          <Button
                            onClick={() => startEditing(key, 'sv', svTranslation.draft_value || svTranslation.published_value || '')}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-none rounded-l-md border-r"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          {svTranslation.draft_value && (
                            <Button
                              onClick={() => handlePublishSingle('sv', key)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-none border-r text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Upload className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            onClick={() => onDelete('sv', key)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-none rounded-r-md text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4">
                      <Button
                        onClick={() => startEditing(key, 'sv', '')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Svenska
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
