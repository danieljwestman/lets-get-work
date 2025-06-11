
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseTranslationSubscriptionProps {
  themeId: string;
  language: 'en' | 'sv';
  onUpdate: () => void;
  context: 'public' | 'admin';
}

interface TranslationPayload {
  new?: {
    published_value?: string;
    draft_value?: string;
    [key: string]: any;
  };
  old?: {
    published_value?: string;
    draft_value?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const useTranslationSubscription = ({
  themeId,
  language,
  onUpdate,
  context
}: UseTranslationSubscriptionProps) => {
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!themeId || !language) return;

    const debouncedUpdate = () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        console.log(`🔄 ${context.toUpperCase()}: Debounced translation update for ${themeId}/${language}`);
        onUpdate();
      }, 300); // 300ms debounce
    };

    // Use context-specific channel names to avoid conflicts
    const channelName = `${context}-translations-${themeId}-${language}`;
    console.log(`🔌 ${context.toUpperCase()}: Setting up subscription: ${channelName}`);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'translations',
          filter: `theme_id=eq.${themeId}`
        },
        (payload: TranslationPayload) => {
          console.log(`🔄 ${context.toUpperCase()}: Translation change detected:`, payload);
          
          // For public context, only update when published_value changes
          if (context === 'public') {
            const isPublishedChange = payload.new?.published_value !== payload.old?.published_value;
            if (isPublishedChange) {
              debouncedUpdate();
            }
          } else {
            // For admin context, update on any change
            debouncedUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`🔌 ${context.toUpperCase()}: Cleaning up subscription: ${channelName}`);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [themeId, language, onUpdate, context]);
};
