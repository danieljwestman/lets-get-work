
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Theme {
  id: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding: any;
  content: any;
  danibot: any;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useThemesData = () => {
  const { user } = useAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState<string | null>(null);

  const fetchThemes = async () => {
    if (!user) {
      setThemes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('themes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }); // Changed to oldest first

      if (fetchError) {
        throw fetchError;
      }

      setThemes(data || []);
    } catch (err) {
      console.error('Error fetching themes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  const generateUniqueThemeId = async (baseId: string): Promise<string> => {
    let proposedId = `${baseId}-copy`;
    let counter = 1;

    while (true) {
      const { data, error } = await supabase
        .from('themes')
        .select('theme_id')
        .eq('user_id', user!.id)
        .eq('theme_id', proposedId)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found, ID is unique
        return proposedId;
      }

      if (error) {
        throw error;
      }

      // If we found a row, try the next increment
      counter++;
      proposedId = `${baseId}-copy${counter}`;
    }
  };

  const copyTranslations = async (originalThemeId: string, newThemeId: string) => {
    const { data: translations, error: fetchError } = await supabase
      .from('translations')
      .select('*')
      .eq('theme_id', originalThemeId)
      .eq('user_id', user!.id);

    if (fetchError) {
      throw fetchError;
    }

    if (translations && translations.length > 0) {
      const newTranslations = translations.map(translation => ({
        theme_id: newThemeId,
        language: translation.language,
        translation_key: translation.translation_key,
        published_value: translation.published_value,
        draft_value: translation.draft_value,
        user_id: user!.id
      }));

      const { error: insertError } = await supabase
        .from('translations')
        .insert(newTranslations);

      if (insertError) {
        throw insertError;
      }
    }
  };

  const copyTheme = async (originalTheme: Theme) => {
    if (!user) return;

    try {
      setCopying(originalTheme.theme_id);

      // Generate unique theme_id
      const newThemeId = await generateUniqueThemeId(originalTheme.theme_id);

      // Create the new theme
      const newTheme = {
        theme_id: newThemeId,
        name: `${originalTheme.name} Copy`,
        browser_title: originalTheme.browser_title,
        branding: originalTheme.branding,
        content: originalTheme.content,
        danibot: originalTheme.danibot,
        user_id: user.id
      };

      const { error: insertError } = await supabase
        .from('themes')
        .insert(newTheme);

      if (insertError) {
        throw insertError;
      }

      // Copy translations
      await copyTranslations(originalTheme.theme_id, newThemeId);

      // Refresh themes list
      await fetchThemes();

      return newThemeId;
    } catch (err) {
      console.error('Error copying theme:', err);
      throw err;
    } finally {
      setCopying(null);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, [user]);

  return {
    themes,
    loading,
    error,
    copying,
    refreshThemes: fetchThemes,
    copyTheme
  };
};
