
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  action?: 'email_composed' | 'email_form' | 'email_sent';
  emailData?: EmailCompositionData;
}

export interface EmailCompositionData {
  subject?: string;
  content?: string;
  senderName?: string;
  senderEmail?: string;
  inquiryType?: 'job' | 'collaboration' | 'consultation' | 'general';
}

export interface CareerChatAssistantProps {
  // No longer need apiKey prop
}
