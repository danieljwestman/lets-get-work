
import { supabase } from '@/integrations/supabase/client';

export const validateApiKey = (key: string): string => {
  // No longer needed since we're using backend API key
  return '';
};

export const sendMessageToOpenAI = async (message: string, action?: string, emailData?: any): Promise<any> => {
  console.log('Sending message to Supabase Edge Function...');
  
  try {
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: { message, action, emailData }
    });

    if (error) {
      console.error('Supabase Function Error:', error);
      throw new Error(error.message || 'Failed to get AI response');
    }

    if (!data || !data.content) {
      throw new Error('Invalid response from AI service');
    }

    return data;
  } catch (error) {
    console.error('Error calling Supabase function:', error);
    throw error;
  }
};
