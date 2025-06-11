
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TabContentHeader } from './TabContentHeader';
import { TranslationsSideBySide } from './TranslationsSideBySide';
import { Translation } from '@/types/admin';

interface SideBySideTabContentProps {
  translations: Record<string, Translation[]>;
  filteredTranslations: Translation[];
  onSave: (language: 'en' | 'sv', key: string, value: string) => Promise<void>;
  onDelete: (language: 'en' | 'sv', key: string) => Promise<void>;
  onPublishSingle?: (language: 'en' | 'sv', key: string) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

export const SideBySideTabContent: React.FC<SideBySideTabContentProps> = ({
  translations,
  filteredTranslations,
  onSave,
  onDelete,
  onPublishSingle,
  loading,
  saving
}) => {
  const enCounts = {
    drafts: translations.en.filter(t => t.draft_value).length
  };
  const svCounts = {
    drafts: translations.sv.filter(t => t.draft_value).length
  };
  const bothCounts = {
    total: Math.max(translations.en.length, translations.sv.length),
    drafts: enCounts.drafts + svCounts.drafts
  };

  return (
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
  );
};
