
import { sampleNames, emailDomains, inquiryTypes, sources, subjectTemplates, messageTemplates } from './messageSampleData';
import { INQUIRY_TYPE_VALUES } from '@/constants/inquiryTypes';
import { MESSAGE_SOURCE_VALUES } from '@/constants/messageSources';

export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateRandomEmail = (name: string): string => {
  const nameParts = name.toLowerCase().split(' ');
  const domain = getRandomElement(emailDomains);
  const emailFormats = [
    `${nameParts[0]}.${nameParts[1]}@${domain}`,
    `${nameParts[0]}${nameParts[1]}@${domain}`,
    `${nameParts[0][0]}${nameParts[1]}@${domain}`,
    `${nameParts[0]}@${domain}`
  ];
  return getRandomElement(emailFormats);
};

export const generateRandomDate = (daysAgo: number): string => {
  const now = new Date();
  const randomDaysAgo = Math.floor(Math.random() * daysAgo);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  
  const date = new Date(now);
  date.setDate(date.getDate() - randomDaysAgo);
  date.setHours(randomHours, randomMinutes, 0, 0);
  
  return date.toISOString();
};

export const generateDemoMessage = (userId: string, opportunityId: string, index: number) => {
  const senderName = getRandomElement(sampleNames);
  const senderEmail = generateRandomEmail(senderName);
  
  // STRICT validation: Only use centralized inquiry types
  const inquiryType = getRandomElement(INQUIRY_TYPE_VALUES);
  
  // STRICT validation: Only use centralized message sources
  const source = getRandomElement(MESSAGE_SOURCE_VALUES);
  
  const subject = getRandomElement(subjectTemplates);
  const message = getRandomElement(messageTemplates);
  const createdAt = generateRandomDate(45); // Last 45 days
  const emailSentSuccessfully = Math.random() > 0.1; // 90% success rate

  console.log('Generated demo message with validated types:', { inquiryType, source });

  // Double-check validation before returning
  if (!INQUIRY_TYPE_VALUES.includes(inquiryType)) {
    console.error('Invalid inquiry type generated:', inquiryType);
    throw new Error(`Invalid inquiry type: ${inquiryType}. Must be one of: ${INQUIRY_TYPE_VALUES.join(', ')}`);
  }
  
  if (!MESSAGE_SOURCE_VALUES.includes(source)) {
    console.error('Invalid message source generated:', source);
    throw new Error(`Invalid source: ${source}. Must be one of: ${MESSAGE_SOURCE_VALUES.join(', ')}`);
  }

  return {
    user_id: userId,
    opportunity_id: opportunityId,
    sender_name: senderName,
    sender_email: senderEmail,
    subject: subject,
    message: message,
    inquiry_type: inquiryType, // Now guaranteed to be from centralized constants
    source: source, // Now guaranteed to be from centralized constants
    email_sent_successfully: emailSentSuccessfully,
    created_at: createdAt,
    email_id: emailSentSuccessfully ? `msg_${Date.now()}_${index}` : null,
    user_agent: 'Mozilla/5.0 (Demo Data)',
    ip_address: '192.168.1.1'
  };
};
