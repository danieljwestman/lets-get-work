
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Translation } from '@/types/admin';

export const useTranslationManager = (themeId: string, language: 'en' | 'sv') => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const { toast } = useToast();
  const { user } = useAuth();

  const loadTranslations = useCallback(async () => {
    if (!themeId || !language) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('theme_id', themeId)
        .eq('language', language)
        .order('translation_key');

      if (error) throw error;

      const translationData = (data || []) as Translation[];
      setTranslations(translationData);
      setFilteredTranslations(translationData);
    } catch (error) {
      console.error('Error loading translations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load translations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [themeId, language, toast]);

  const filterTranslations = useCallback(() => {
    let filtered = translations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.translation_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.published_value && t.published_value.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.draft_value && t.draft_value.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter === 'published') {
      filtered = filtered.filter(t => t.published_value && !t.draft_value);
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter(t => t.draft_value);
    }

    setFilteredTranslations(filtered);
  }, [translations, searchTerm, statusFilter]);

  const addTranslation = async (key: string, value: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add translations',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('translations')
        .insert({
          theme_id: themeId,
          language,
          translation_key: key,
          draft_value: value,
          published_value: value,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Translation added successfully'
      });

      await loadTranslations();
    } catch (error) {
      console.error('Error adding translation:', error);
      toast({
        title: 'Error',
        description: 'Failed to add translation',
        variant: 'destructive'
      });
    }
  };

  const updateTranslation = async (id: string, updates: Partial<Translation>) => {
    try {
      const { error } = await supabase
        .from('translations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Translation updated successfully'
      });

      await loadTranslations();
    } catch (error) {
      console.error('Error updating translation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update translation',
        variant: 'destructive'
      });
    }
  };

  const deleteTranslation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Translation deleted successfully'
      });

      await loadTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete translation',
        variant: 'destructive'
      });
    }
  };

  const publishDrafts = async () => {
    try {
      const drafts = translations.filter(t => t.draft_value);
      
      const updates = drafts.map(t => ({
        id: t.id,
        published_value: t.draft_value,
        draft_value: null
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('translations')
          .update({ 
            published_value: update.published_value, 
            draft_value: update.draft_value 
          })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Published ${updates.length} draft translations`
      });

      await loadTranslations();
    } catch (error) {
      console.error('Error publishing drafts:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish drafts',
        variant: 'destructive'
      });
    }
  };

  return {
    translations: filteredTranslations,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    loadTranslations,
    filterTranslations,
    addTranslation,
    updateTranslation,
    deleteTranslation,
    publishDrafts
  };
};
