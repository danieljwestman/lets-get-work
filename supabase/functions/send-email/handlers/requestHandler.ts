
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { renderEmailTemplate, sendEmailViaResend } from '../email-service.ts';
import { validateEmailRequest, validateMessageSource } from '../validation.ts';
import { saveMessageToDatabase, updateMessageStatus, createSupabaseClient } from '../database.ts';
import { generateEmailId, getClientInfo, createErrorResponse, createSuccessResponse } from '../utils.ts';
import { checkRateLimit } from '../services/rateLimitService.ts';
import { validateEnvironment } from '../services/environmentService.ts';
import type { EmailRequest, EmailData } from '../types.ts';

export async function handleEmailRequest(req: Request): Promise<Response> {
  try {
    console.log('📧 Starting email send process...');
    
    // Validate environment variables
    const envValidation = validateEnvironment();
    if (!envValidation.isValid) {
      console.error('❌ Environment validation failed:', envValidation.missingVars);
      return createErrorResponse(
        `Configuration Error: Missing required environment variables: ${envValidation.missingVars!.join(', ')}. Please configure these in Supabase Edge Functions settings.`,
        500
      );
    }

    const { CONTACT_EMAIL, COMPANY_WEBSITE, DEFAULT_SENDER_NAME } = envValidation;
    console.log('📧 Using contact email:', CONTACT_EMAIL);
    console.log('📧 Using company website:', COMPANY_WEBSITE);
    console.log('📧 Using default sender name:', DEFAULT_SENDER_NAME);
    
    // Parse and validate request body
    const body: EmailRequest = await req.json();
    console.log('📧 Request body:', JSON.stringify(body, null, 2));
    
    const validation = validateEmailRequest(body);
    if (!validation.isValid) {
      console.error('❌ Validation failed:', validation.error);
      return createErrorResponse(validation.error!, 400);
    }

    const { 
      senderName, 
      senderEmail, 
      message, 
      inquiryType, 
      opportunityId, 
      source = 'contact_form',
      conversationContext
    } = body;

    // Validate source value using centralized validation
    if (!validateMessageSource(source)) {
      console.error('❌ Invalid source value:', source);
      return createErrorResponse('Invalid message source', 400);
    }

    console.log('📧 Using validated source:', source);

    // Initialize Supabase client
    const supabaseClient = createSupabaseClient();

    // Get user_id from opportunity
    let messageUserId = null;
    if (opportunityId && opportunityId !== 'default') {
      const { data: opportunityData, error: opportunityError } = await supabaseClient
        .from('opportunities')
        .select('user_id')
        .eq('opportunity_id', opportunityId)
        .single();

      if (opportunityError) {
        console.error('❌ Error fetching opportunity:', opportunityError);
      } else if (opportunityData) {
        messageUserId = opportunityData.user_id;
        console.log('✅ Found opportunity owner user_id:', messageUserId);
      }
    }

    // Check rate limiting
    const { clientIP } = getClientInfo(req);
    const rateLimitResult = await checkRateLimit(supabaseClient, clientIP);
    if (!rateLimitResult.allowed) {
      console.warn('⚠️ Rate limit exceeded');
      return createErrorResponse('Too many requests', 429);
    }

    // Prepare sanitized email data
    const emailData: EmailData = {
      sanitizedName: senderName.trim().replace(/[<>]/g, ''),
      sanitizedEmail: senderEmail.trim().replace(/[<>]/g, ''),
      sanitizedMessage: message.trim().replace(/[<>]/g, ''),
      sanitizedInquiryType: inquiryType.trim().replace(/[<>]/g, ''),
      opportunityId: opportunityId || 'default',
      source: source,
      conversationContext: conversationContext || null
    };

    // Save message to database
    const emailId = generateEmailId();
    const emailSubject = `Contact from ${emailData.sanitizedName}`;
    const { userAgent } = getClientInfo(req);
    
    console.log('💾 Saving message to database...');
    const messageResult = await saveMessageToDatabase(
      supabaseClient,
      emailData,
      emailSubject,
      clientIP,
      userAgent,
      emailId
    );

    // Add user_id to message if we found one
    if (messageUserId) {
      const { error: updateUserError } = await supabaseClient
        .from('messages')
        .update({ user_id: messageUserId })
        .eq('id', messageResult.id);

      if (updateUserError) {
        console.error('❌ Error updating message user_id:', updateUserError);
      }
    }

    // Generate and send email
    console.log('📧 Rendering beautiful email template...');
    
    try {
      const emailHtml = renderEmailTemplate(emailData, emailSubject, COMPANY_WEBSITE!, DEFAULT_SENDER_NAME!);
      
      console.log('📧 Sending email with beautiful template...');
      const emailResult = await sendEmailViaResend(emailHtml, emailSubject, emailData.sanitizedEmail, CONTACT_EMAIL!, DEFAULT_SENDER_NAME!);

      // Update database with email success status
      console.log('✅ Email sent successfully, updating database...');
      await updateMessageStatus(supabaseClient, messageResult.id);

      console.log('✅ Email process completed successfully');
      return createSuccessResponse({ 
        data: emailResult, 
        messageId: messageResult.id,
        message: 'Email sent successfully with beautiful template' 
      });

    } catch (emailError: any) {
      console.error('❌ Email sending error:', emailError);
      
      return createErrorResponse(
        `Failed to send email: ${emailError.message}`,
        500
      );
    }

  } catch (error: any) {
    console.error('💥 Unexpected error:', error);
    return createErrorResponse(
      `Internal server error: ${error.message}`,
      500
    );
  }
}
