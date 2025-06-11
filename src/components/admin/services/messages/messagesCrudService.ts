
import { supabase } from '@/integrations/supabase/client';
import { generateDemoMessage } from './messageDataGenerator';

export const createDemoMessages = async (userId: string, opportunityId: string, messageCount: number) => {
  console.log('MessagesCrudService: Creating demo messages for user:', userId, 'opportunity:', opportunityId);
  
  try {
    // Verify the user is authenticated and matches the provided userId
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      throw new Error('Authentication required - please log in to create demo data');
    }

    const demoMessages = [];

    for (let i = 0; i < messageCount; i++) {
      const demoMessage = generateDemoMessage(userId, opportunityId, i);
      demoMessages.push(demoMessage);
    }

    console.log('Generated demo messages:', demoMessages.length);

    // Insert demo messages with proper user_id
    const { error: insertError } = await supabase
      .from('messages')
      .insert(demoMessages);

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`Failed to insert demo messages: ${insertError.message}`);
    }

    console.log('Successfully inserted', messageCount, 'demo messages');
    return { success: true, count: messageCount };
  } catch (error) {
    console.error('MessagesCrudService: Error creating demo messages:', error);
    throw error;
  }
};

export const clearUserMessages = async (userId: string) => {
  console.log('MessagesCrudService: Starting clear operation for user:', userId);
  
  try {
    // Verify the user is authenticated and matches the provided userId
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      throw new Error('Authentication required - please log in to clear messages');
    }

    // With RLS enabled, we can simply delete all messages
    // The RLS policy will automatically restrict this to only the user's own messages
    const { error: deleteError, count } = await supabase
      .from('messages')
      .delete({ count: 'exact' })
      .eq('user_id', userId);

    if (deleteError) {
      console.error('MessagesCrudService: Delete error:', deleteError);
      throw new Error(`Failed to delete messages: ${deleteError.message}`);
    }

    console.log('MessagesCrudService: Successfully deleted', count, 'messages');
    
    return { success: true, cleared: count || 0 };
  } catch (error) {
    console.error('MessagesCrudService: Unexpected error:', error);
    throw error;
  }
};
