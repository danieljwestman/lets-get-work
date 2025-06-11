
import { supabase } from '@/integrations/supabase/client';
import { ContactFormData } from '../utils/formValidation';
import { MESSAGE_SOURCE_VALUES } from '@/constants/messageSources';

const resolveOpportunityOwner = async (opportunityId: string): Promise<string | null> => {
  try {
    console.log('🔍 Resolving opportunity owner for:', opportunityId);
    
    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select('user_id')
      .eq('opportunity_id', opportunityId)
      .single();

    if (error || !opportunity) {
      console.error('❌ Failed to resolve opportunity owner:', error);
      return null;
    }

    console.log('✅ Resolved opportunity owner:', opportunity.user_id);
    return opportunity.user_id;
  } catch (error) {
    console.error('❌ Error resolving opportunity owner:', error);
    return null;
  }
};

export const saveMessageToDatabase = async (
  formData: ContactFormData, 
  opportunityId: string,
  emailId?: string, 
  success: boolean = false
) => {
  try {
    console.log('💾 Saving message to database for opportunity:', opportunityId);
    
    // Always resolve the opportunity owner's user_id
    const opportunityOwnerId = await resolveOpportunityOwner(opportunityId);
    
    if (!opportunityOwnerId) {
      console.error('❌ Could not resolve opportunity owner for:', opportunityId);
      return null;
    }
    
    // Generate a unique identifier to prevent duplicates
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Use centralized source constant
    const sourceValue = MESSAGE_SOURCE_VALUES.includes('contact_form') ? 'contact_form' : MESSAGE_SOURCE_VALUES[0];
    
    const messageData = {
      sender_name: formData.senderName,
      sender_email: formData.senderEmail,
      subject: `Contact from ${formData.senderName}`,
      message: formData.message,
      inquiry_type: formData.inquiryType,
      source: sourceValue,
      email_sent_successfully: success,
      email_id: emailId || uniqueId,
      user_agent: navigator.userAgent,
      opportunity_id: opportunityId,
      user_id: opportunityOwnerId // Always set the opportunity owner's user_id
    };

    console.log('📤 Inserting message with user_id:', opportunityOwnerId);

    const { error } = await supabase
      .from('messages')
      .insert(messageData);

    if (error) {
      console.error('❌ Error saving message to database:', error);
      return null;
    }
    
    console.log('✅ Message saved successfully');
    return uniqueId;
  } catch (error) {
    console.error('❌ Failed to save message:', error);
    return null;
  }
};
