
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TabContentHeader } from './TabContentHeader';
import { TranslationsList } from './TranslationsList';
import { Translation } from '@/types/admin';

interface LanguageTabContentProps {
  language: 'en' | 'sv';
  translations: Translation[];
  filteredTranslations: Translation[];
  onSave: (language: 'en' | 'sv', key: string, value: string) => Promise<void>;
  onDelete: (language: 'en' | 'sv', key: string) => Promise<void>;
  onPublishSingle?: (language: 'en' | 'sv', key: string) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

export const LanguageTabContent: React.FC<LanguageTabContentProps> = ({
  language,
  translations,
  filteredTranslations,
  onSave,
  onDelete,
  onPublishSingle,
  loading,
  saving
}) => {
  const getLanguageConfig = (lang: 'en' | 'sv') => {
    if (lang === 'en') {
      return {
        title: 'English Translations',
        description: 'Manage your English content'
      };
    }
    return {
      title: 'Swedish Translations',
      description: 'Manage your Swedish content'
    };
  };

  const config = getLanguageConfig(language);
  const published = translations.filter(t => t.published_value && !t.draft_value).length;
  const drafts = translations.filter(t => t.draft_value).length;

  return (
    <TabsContent value={language} className="m-0">
      <div className="p-6 space-y-6">
        <TabContentHeader
          title={config.title}
          description={config.description}
          publishedCount={published}
          draftCount={drafts}
        />
        <TranslationsList 
          translations={filteredTranslations}
          language={language}
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
