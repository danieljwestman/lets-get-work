
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TranslationsList } from './TranslationsList';
import { TranslationsSideBySide } from './TranslationsSideBySide';
import { Globe, Languages, ArrowLeftRight } from 'lucide-react';
import { Translation } from '@/types/admin';

interface TranslationTabsProps {
  activeLanguage: 'en' | 'sv' | 'both';
  onLanguageChange: (language: 'en' | 'sv' | 'both') => void;
  translations: Record<string, Translation[]>;
  filteredTranslations: Translation[];
  onSave: (language: 'en' | 'sv', key: string, value: string) => Promise<void>;
  onDelete: (language: 'en' | 'sv', key: string) => Promise<void>;
  onPublishSingle?: (language: 'en' | 'sv', key: string) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

export const TranslationTabs: React.FC<TranslationTabsProps> = ({
  activeLanguage,
  onLanguageChange,
  translations,
  filteredTranslations,
  onSave,
  onDelete,
  onPublishSingle,
  loading,
  saving
}) => {
  // Calculate status counts
  const getStatusCounts = (lang: 'en' | 'sv') => {
    const langTranslations = translations[lang];
    const published = langTranslations.filter(t => t.published_value && !t.draft_value).length;
    const drafts = langTranslations.filter(t => t.draft_value).length;
    
    return { published, drafts, total: langTranslations.length };
  };

  const enCounts = getStatusCounts('en');
  const svCounts = getStatusCounts('sv');
  const bothCounts = {
    total: Math.max(translations.en.length, translations.sv.length),
    drafts: enCounts.drafts + svCounts.drafts
  };

  // Helper function to format draft text with proper singular/plural
  const formatDraftText = (count: number) => {
    return count === 1 ? `${count} draft` : `${count} drafts`;
  };

  return (
    <Tabs value={activeLanguage} onValueChange={(value) => onLanguageChange(value as 'en' | 'sv' | 'both')}>
      {/* Enhanced Tab List */}
      <div className="bg-gray-50/50">
        <TabsList className="w-full h-auto p-1 bg-transparent grid grid-cols-3 gap-1">
          <TabsTrigger 
            value="en" 
            className="flex flex-col items-center gap-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border border-gray-200 rounded-lg transition-all"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="font-semibold">English</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white text-gray-700 border-gray-300 text-xs">
                {enCounts.total} translations
              </Badge>
              {enCounts.drafts > 0 && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs font-medium">
                  {formatDraftText(enCounts.drafts)}
                </Badge>
              )}
            </div>
          </TabsTrigger>

          <TabsTrigger 
            value="sv" 
            className="flex flex-col items-center gap-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border border-gray-200 rounded-lg transition-all"
          >
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-blue-600" />
              <span className="font-semibold">Swedish</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white text-gray-700 border-gray-300 text-xs">
                {svCounts.total} translations
              </Badge>
              {svCounts.drafts > 0 && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs font-medium">
                  {formatDraftText(svCounts.drafts)}
                </Badge>
              )}
            </div>
          </TabsTrigger>

          <TabsTrigger 
            value="both" 
            className="flex flex-col items-center gap-2 py-4 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border border-gray-200 rounded-lg transition-all"
          >
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-blue-600" />
              <span className="font-semibold">Side by Side</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white text-gray-700 border-gray-300 text-xs">
                {bothCounts.total} keys
              </Badge>
              {bothCounts.drafts > 0 && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs font-medium">
                  {formatDraftText(bothCounts.drafts)}
                </Badge>
              )}
            </div>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Content */}
      <div className="bg-white">
        <TabsContent value="en" className="m-0">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">English Translations</h3>
                <p className="text-gray-600 mt-1">Manage your English content</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {enCounts.published} published
                </Badge>
                {enCounts.drafts > 0 && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {formatDraftText(enCounts.drafts)}
                  </Badge>
                )}
              </div>
            </div>
            <TranslationsList 
              translations={filteredTranslations}
              language="en"
              onSave={onSave}
              onDelete={onDelete}
              onPublishSingle={onPublishSingle}
              loading={loading}
              saving={saving}
            />
          </div>
        </TabsContent>

        <TabsContent value="sv" className="m-0">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Swedish Translations</h3>
                <p className="text-gray-600 mt-1">Manage your Swedish content</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {svCounts.published} published
                </Badge>
                {svCounts.drafts > 0 && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {formatDraftText(svCounts.drafts)}
                  </Badge>
                )}
              </div>
            </div>
            <TranslationsList 
              translations={filteredTranslations}
              language="sv"
              onSave={onSave}
              onDelete={onDelete}
              onPublishSingle={onPublishSingle}
              loading={loading}
              saving={saving}
            />
          </div>
        </TabsContent>

        <TabsContent value="both" className="m-0">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Side by Side Comparison</h3>
                <p className="text-gray-600 mt-1">Compare and manage both languages simultaneously</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {bothCounts.total} translation keys
                </Badge>
                {bothCounts.drafts > 0 && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {bothCounts.drafts === 1 ? '1 draft change' : `${bothCounts.drafts} draft changes`}
                  </Badge>
                )}
              </div>
            </div>
            <TranslationsSideBySide
              translations={translations}
              filteredTranslations={filteredTranslations}
              onSave={onSave}
              onDelete={onDelete}
              onPublishSingle={onPublishSingle}
              loading={loading}
              saving={saving}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
