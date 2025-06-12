
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TranslationTabs } from './translations/TranslationTabs';
import { PublishPanel } from './translations/PublishPanel';
import { useTranslations } from './translations/useTranslations';
import { Translation } from '@/types/admin';

interface ThemeTranslationsProps {
  themeId: string;
}

export const ThemeTranslations: React.FC<ThemeTranslationsProps> = ({ themeId }) => {
  const {
    translations,
    loading,
    saving,
    saveTranslation,
    publishSingleTranslation,
    deleteTranslation,
    loadTranslations
  } = useTranslations(themeId);

  const [activeLanguage, setActiveLanguage] = useState<'en' | 'sv' | 'both'>('en');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTranslations = useMemo(() => {
    let allTranslations: Translation[] = [];
    
    if (activeLanguage === 'both') {
      allTranslations = [...translations.en, ...translations.sv];
    } else {
      allTranslations = translations[activeLanguage] || [];
    }

    if (!searchTerm) {
      return allTranslations;
    }

    const searchLower = searchTerm.toLowerCase();
    return allTranslations.filter(translation => {
      const keyMatch = translation.translation_key.toLowerCase().includes(searchLower);
      const valueMatch = (translation.draft_value || translation.published_value || '').toLowerCase().includes(searchLower);
      return keyMatch || valueMatch;
    });
  }, [translations, activeLanguage, searchTerm]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Translations</CardTitle>
          <p className="text-sm text-gray-600">
            Manage translations for this theme. Translations are theme-specific and will be used across all opportunities that use this theme.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <PublishPanel
              translations={translations}
              companyId={themeId}
              onPublishSuccess={loadTranslations}
            />
            
            <TranslationTabs
              activeLanguage={activeLanguage}
              onLanguageChange={setActiveLanguage}
              translations={translations}
              filteredTranslations={filteredTranslations}
              onSave={saveTranslation}
              onDelete={deleteTranslation}
              onPublishSingle={publishSingleTranslation}
              loading={loading}
              saving={saving}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
