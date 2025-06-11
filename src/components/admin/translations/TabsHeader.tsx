
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Globe, Languages, ArrowLeftRight } from 'lucide-react';
import { Translation } from '@/types/admin';

interface TabsHeaderProps {
  translations: Record<string, Translation[]>;
}

export const TabsHeader: React.FC<TabsHeaderProps> = ({ translations }) => {
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
  );
};
