
import { supabase } from '@/integrations/supabase/client';
import { Translation } from '@/types/admin';

// Function to rebuild nested translation objects from flat keys
const rebuildTranslationStructure = (flatTranslations: Array<{ key: string; value: string }>) => {
  const result: any = {};
  
  flatTranslations.forEach(({ key, value }) => {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      
      // Handle array indices
      if (/^\d+$/.test(keys[i + 1])) {
        if (!current[k]) {
          current[k] = [];
        }
        const index = parseInt(keys[i + 1]);
        if (!current[k][index]) {
          current[k][index] = {};
        }
        current = current[k][index];
        i++; // Skip the index key
      } else {
        if (!current[k]) {
          current[k] = {};
        }
        current = current[k];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
  });
  
  return result;
};

/**
 * DATABASE-ONLY TRANSLATION SYSTEM
 * 
 * This system stores ALL translations in the database and loads them at runtime.
 * The JSON files are SEED DATA ONLY and not used at runtime.
 * 
 * This export function is for REFERENCE/BACKUP purposes only.
 */
export const exportTranslationsForReference = async (themeId: string) => {
  try {
    console.log(`🗄️ DATABASE-ONLY: Exporting translations for reference (theme: ${themeId})`);
    
    // Get all translations for the theme
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('theme_id', themeId);

    if (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }

    const translations = (data || []) as Translation[];
    
    // Group by language
    const groupedTranslations = {
      en: translations.filter(t => t.language === 'en'),
      sv: translations.filter(t => t.language === 'sv')
    };

    const exportData: Record<string, any> = {};

    for (const [language, langTranslations] of Object.entries(groupedTranslations)) {
      console.log(`Processing ${language} translations:`, langTranslations.length);
      
      if (langTranslations.length === 0) {
        console.log(`No translations found for ${language}, skipping...`);
        continue;
      }
      
      // Convert to flat key-value pairs using published values
      const flatTranslations = langTranslations.map(t => ({
        key: t.translation_key,
        value: t.published_value || t.draft_value || ''
      }));

      // Rebuild nested structure
      const nestedTranslations = rebuildTranslationStructure(flatTranslations);
      
      console.log(`Rebuilt ${language} structure:`, Object.keys(nestedTranslations));
      exportData[language] = nestedTranslations;
    }

    console.log(`✅ DATABASE-ONLY: Generated reference export for ${Object.keys(exportData).length} languages`);
    return { success: true, exportData };
    
  } catch (error) {
    console.error('Error exporting translations for reference:', error);
    return { success: false, error };
  }
};

// Helper function to download JSON for reference
export const downloadTranslationReference = (themeId: string, language: string, data: any) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${themeId}-${language}-translations-reference.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
