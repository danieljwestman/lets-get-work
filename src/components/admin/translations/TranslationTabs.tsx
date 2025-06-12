
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TabsHeader } from './TabsHeader';
import { TranslationSearch } from './TranslationSearch';
import { LanguageTabContent } from './LanguageTabContent';
import { SideBySideTabContent } from './SideBySideTabContent';
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
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
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
  saving,
  searchTerm = '',
  onSearchChange = () => {}
}) => {
  return (
    <Tabs value={activeLanguage} onValueChange={(value) => onLanguageChange(value as 'en' | 'sv' | 'both')}>
      <TabsHeader translations={translations} />

      {/* Search filter positioned below tabs - centered and smaller width */}
      <div className="flex justify-center py-4 bg-gray-50/50">
        <div className="w-full max-w-md">
          <TranslationSearch
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
        </div>
      </div>

      <div className="bg-white">
        <LanguageTabContent
          language="en"
          translations={translations.en}
          filteredTranslations={filteredTranslations}
          onSave={onSave}
          onDelete={onDelete}
          onPublishSingle={onPublishSingle}
          loading={loading}
          saving={saving}
        />

        <LanguageTabContent
          language="sv"
          translations={translations.sv}
          filteredTranslations={filteredTranslations}
          onSave={onSave}
          onDelete={onDelete}
          onPublishSingle={onPublishSingle}
          loading={loading}
          saving={saving}
        />

        <SideBySideTabContent
          translations={translations}
          filteredTranslations={filteredTranslations}
          onSave={onSave}
          onDelete={onDelete}
          onPublishSingle={onPublishSingle}
          loading={loading}
          saving={saving}
        />
      </div>
    </Tabs>
  );
};
