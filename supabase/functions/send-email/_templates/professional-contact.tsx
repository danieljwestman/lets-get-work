
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Img,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ProfessionalContactEmailProps {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  inquiryType: string;
  conversationContext?: string;
}

const formatConversationContext = (conversationContext: string): string => {
  if (!conversationContext) return '';
  
  try {
    // Try to parse if it's JSON format
    const messages = JSON.parse(conversationContext);
    if (Array.isArray(messages)) {
      return messages.map((msg: any, index: number) => {
        const sender = msg.sender === 'user' ? 'User' : 'DaniBot';
        const content = msg.content || '';
        return `${index + 1}. ${sender}: ${content}`;
      }).join('\n\n');
    }
  } catch (e) {
    // If not JSON, treat as plain text and try to format it
    // Split by common patterns that might indicate message boundaries
    const lines = conversationContext.split(/(?:User:|DaniBot:|Assistant:)/);
    if (lines.length > 1) {
      return lines
        .filter(line => line.trim())
        .map((line, index) => {
          const isEven = index % 2 === 0;
          const sender = isEven ? 'User' : 'DaniBot';
          return `${Math.floor(index / 2) + 1}. ${sender}: ${line.trim()}`;
        })
        .join('\n\n');
    }
  }
  
  // Fallback: just return the original with some basic formatting
  return conversationContext.replace(/\s+/g, ' ').trim();
};

export const ProfessionalContactEmail = ({
  senderName,
  senderEmail,
  subject,
  message,
  inquiryType,
  conversationContext,
}: ProfessionalContactEmailProps) => {
  const getInquiryTypeLabel = (type: string) => {
    switch (type) {
      case 'job': return 'Job Opportunity';
      case 'collaboration': return 'Collaboration';
      case 'consultation': return 'Consultation';
      default: return 'General Inquiry';
    }
  };

  const getInquiryTypeColor = (type: string) => {
    switch (type) {
      case 'job': return '#2563eb';
      case 'collaboration': return '#7c3aed';
      case 'consultation': return '#059669';
      default: return '#6b7280';
    }
  };

  const formattedContext = conversationContext ? formatConversationContext(conversationContext) : '';

  return (
    <Html>
      <Head />
      <Preview>New contact from {senderName}: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>New Contact Message</Heading>
            <Text style={subtitle}>You have received a new message through your digital resume</Text>
          </Section>

          {/* Contact Information Card */}
          <Section style={card}>
            <Text style={cardTitle}>Contact Information</Text>
            <Section style={contactGrid}>
              <Section style={contactItem}>
                <Text style={label}>Name</Text>
                <Text style={value}>{senderName}</Text>
              </Section>
              <Section style={contactItem}>
                <Text style={label}>Email</Text>
                <Link href={`mailto:${senderEmail}`} style={emailLink}>{senderEmail}</Link>
              </Section>
              <Section style={contactItem}>
                <Text style={label}>Inquiry Type</Text>
                <Section style={{...badge, backgroundColor: getInquiryTypeColor(inquiryType)}}>
                  <Text style={badgeText}>{getInquiryTypeLabel(inquiryType)}</Text>
                </Section>
              </Section>
            </Section>
          </Section>

          {/* Message Card */}
          <Section style={card}>
            <Text style={cardTitle}>Message</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          {/* Context Card (if available) with improved formatting */}
          {formattedContext && (
            <Section style={card}>
              <Text style={cardTitle}>DaniBot Conversation Context</Text>
              <Text style={contextText}>{formattedContext}</Text>
            </Section>
          )}

          {/* Action Buttons */}
          <Section style={actionSection}>
            <Link
              href={`mailto:${senderEmail}?subject=Re: ${subject}`}
              style={primaryButton}
            >
              Reply to {senderName}
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This message was sent through your digital resume contact form powered by DaniBot.
            </Text>
            <Text style={footerText}>
              <Link href="https://danielwestman.com" style={footerLink}>
                Visit Digital Resume
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ProfessionalContactEmail;

// Modern, clean styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '20px 0',
};

const container = {
  margin: '0 auto',
  padding: '0 20px',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 8px 0',
};

const subtitle = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0',
};

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '20px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
};

const cardTitle = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const contactGrid = {
  display: 'grid',
  gap: '16px',
};

const contactItem = {
  marginBottom: '12px',
};

const label = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const value = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
};

const emailLink = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '500',
  textDecoration: 'none',
};

const badge = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '20px',
  backgroundColor: '#6b7280',
};

const badgeText = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const messageText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const contextText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
  padding: '12px',
  backgroundColor: '#f1f5f9',
  borderRadius: '6px',
  fontStyle: 'italic',
  border: '1px solid #e2e8f0',
  whiteSpace: 'pre-wrap' as const,
};

const actionSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const primaryButton = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  textAlign: 'center' as const,
  paddingTop: '16px',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '4px 0',
};

const footerLink = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: '500',
};
