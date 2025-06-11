
import { supabase } from '@/integrations/supabase/client';
import { createDemoMessages, clearUserMessages } from './messages/messagesCrudService';

export const createMessagesDemoData = async () => {
  try {
    console.log('Starting to create demo messages...');
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('No authenticated user found:', userError);
      throw new Error('You must be logged in to create demo data');
    }

    console.log('Authenticated user found:', user.id);

    // Get user's opportunities - try to find any opportunity owned by the user
    const { data: opportunities, error: oppError } = await supabase
      .from('opportunities')
      .select('opportunity_id')
      .eq('user_id', user.id)
      .limit(1);

    if (oppError) {
      console.error('Failed to fetch opportunities:', oppError);
      throw new Error(`Failed to fetch opportunities: ${oppError.message}`);
    }

    if (!opportunities || opportunities.length === 0) {
      console.error('No opportunities found for user');
      throw new Error('You need to have at least one opportunity to create demo messages');
    }

    const opportunityId = opportunities[0].opportunity_id;
    console.log('Using opportunity ID:', opportunityId);

    // Generate 20-30 demo messages
    const messageCount = 20 + Math.floor(Math.random() * 11); // 20-30 messages
    console.log('Creating', messageCount, 'demo messages');
    
    const result = await createDemoMessages(user.id, opportunityId, messageCount);
    console.log('Successfully created demo messages');
    return result;
  } catch (error) {
    console.error('Error creating demo messages:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const clearExistingMessages = async (userId: string) => {
  try {
    console.log('Starting to clear messages for user:', userId);
    const result = await clearUserMessages(userId);
    console.log('Successfully cleared messages');
    return result;
  } catch (error) {
    console.error('Error clearing messages:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
