
import { render } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { ProfessionalContactEmail } from './_templates/professional-contact.tsx'
import { EmailData } from './types.ts'

export const renderEmailTemplate = (
  emailData: EmailData, 
  emailSubject: string, 
  companyWebsite: string,
  defaultSenderName: string
) => {
  console.log('🎨 Rendering beautiful React Email template with data:', {
    name: emailData.sanitizedName,
    email: emailData.sanitizedEmail,
    inquiryType: emailData.sanitizedInquiryType,
    hasContext: !!emailData.conversationContext,
    companyWebsite,
    defaultSenderName
  });
  
  return render(
    React.createElement(ProfessionalContactEmail, {
      senderName: emailData.sanitizedName,
      senderEmail: emailData.sanitizedEmail,
      subject: emailSubject,
      message: emailData.sanitizedMessage,
      inquiryType: emailData.sanitizedInquiryType,
      conversationContext: emailData.conversationContext,
      companyWebsite,
      defaultSenderName
    })
  );
}

export const sendEmailViaResend = async (
  emailHtml: string,
  emailSubject: string,
  senderEmail: string,
  contactEmail: string,
  defaultSenderName: string
) => {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  console.log('📬 Sending beautiful email to:', contactEmail);
  console.log('📬 Reply-to:', senderEmail);
  console.log('📬 From:', defaultSenderName);

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${defaultSenderName} <noreply@resend.dev>`,
      to: [contactEmail],
      subject: emailSubject,
      html: emailHtml,
      reply_to: senderEmail,
    }),
  })

  const emailResult = await emailResponse.json()

  if (!emailResponse.ok) {
    console.error('❌ Resend API error:', emailResult);
    throw new Error(`Failed to send email: ${emailResult.message || emailResult.error || 'Unknown error'}`)
  }

  console.log('✅ Email sent successfully via Resend:', emailResult.id);
  return emailResult
}
