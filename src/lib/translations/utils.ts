
interface FlatTranslation {
  key: string;
  value: string;
}

/**
 * Rebuilds nested translation objects from flat key-value pairs
 * Used by both public and admin translation systems
 */
export const rebuildTranslationStructure = (flatTranslations: FlatTranslation[]) => {
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
 * Flattens nested translation objects into key-value pairs
 * Useful for saving translations back to the database
 */
export const flattenTranslationStructure = (obj: any, prefix = ''): FlatTranslation[] => {
  const result: FlatTranslation[] = [];
  
  const flatten = (current: any, currentPrefix: string) => {
    Object.keys(current).forEach(key => {
      const newKey = currentPrefix ? `${currentPrefix}.${key}` : key;
      
      if (Array.isArray(current[key])) {
        current[key].forEach((item: any, index: number) => {
          if (typeof item === 'object' && item !== null) {
            flatten(item, `${newKey}.${index}`);
          } else {
            result.push({ key: `${newKey}.${index}`, value: String(item) });
          }
        });
      } else if (typeof current[key] === 'object' && current[key] !== null) {
        flatten(current[key], newKey);
      } else {
        result.push({ key: newKey, value: String(current[key]) });
      }
    });
  };
  
  flatten(obj, prefix);
  return result;
};

/**
 * Merges published and draft values for admin display
 * Prioritizes published_value, falls back to draft_value
 */
export const mergeTranslationValues = (
  translations: Array<{
    translation_key: string;
    published_value?: string;
    draft_value?: string;
  }>
) => {
  return translations.map(t => ({
    key: t.translation_key,
    value: t.published_value || t.draft_value || ''
  }));
};

/**
 * Extracts only published values for public display
 */
export const extractPublishedValues = (
  translations: Array<{
    translation_key: string;
    published_value?: string;
  }>
) => {
  return translations
    .filter(t => t.published_value)
    .map(t => ({
      key: t.translation_key,
      value: t.published_value!
    }));
};
