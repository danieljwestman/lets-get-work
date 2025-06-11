
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { EmailData } from './types.ts'

export const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  return createClient(supabaseUrl, supabaseKey)
}

export const checkDuplicateMessage = async (
  supabase: any,
  sanitizedEmail: string,
  sanitizedMessage: string,
  opportunityId: string
) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('id')
    .eq('sender_email', sanitizedEmail)
    .eq('message', sanitizedMessage)
    .eq('opportunity_id', opportunityId)
    .gte('created_at', oneHourAgo)
    .limit(1)

  return recentMessages && recentMessages.length > 0 ? recentMessages[0] : null
}

export const resolveOpportunityOwner = async (supabase: any, opportunityId: string) => {
  console.log('🔍 Resolving opportunity owner for:', opportunityId);
  
  // Get the opportunity owner's user_id
  const { data: opportunity, error: opportunityError } = await supabase
    .from('opportunities')
    .select('user_id')
    .eq('opportunity_id', opportunityId)
    .single();

  if (opportunityError || !opportunity) {
    console.error('❌ Failed to resolve opportunity owner:', opportunityError);
    throw new Error(`Failed to resolve opportunity owner: ${opportunityError?.message || 'Opportunity not found'}`);
  }

  console.log('✅ Resolved opportunity owner:', opportunity.user_id);
  return opportunity.user_id;
}

export const saveMessageToDatabase = async (
  supabase: any,
  emailData: EmailData,
  emailSubject: string,
  clientIP: string,
  userAgent: string,
  emailId: string
) => {
  console.log('💾 Saving message to database for opportunity:', emailData.opportunityId);
  
  // Always resolve the opportunity owner's user_id
  const opportunityOwnerId = await resolveOpportunityOwner(supabase, emailData.opportunityId);
  
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert({
      sender_name: emailData.sanitizedName,
      sender_email: emailData.sanitizedEmail,
      subject: emailSubject,
      message: emailData.sanitizedMessage,
      inquiry_type: emailData.sanitizedInquiryType,
      opportunity_id: emailData.opportunityId,
      source: emailData.source,
      conversation_context: emailData.conversationContext,
      ip_address: clientIP === 'unknown' ? null : clientIP,
      user_agent: userAgent,
      email_id: emailId,
      email_sent_successfully: false,
      user_id: opportunityOwnerId // Always set the opportunity owner's user_id
    })
    .select()
    .single()

  if (messageError) {
    console.error('❌ Failed to save message:', messageError);
    throw new Error(`Failed to save message: ${messageError.message}`)
  }

  console.log('✅ Message saved with user_id:', opportunityOwnerId);
  return messageData
}

export const updateMessageStatus = async (supabase: any, messageId: string) => {
  const { error: updateError } = await supabase
    .from('messages')
    .update({ email_sent_successfully: true })
    .eq('id', messageId)

  if (updateError) {
    console.error('Error updating message status:', updateError)
  }
}
