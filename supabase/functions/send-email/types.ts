
export interface EmailRequest {
  senderName: string;
  senderEmail: string;
  message: string;
  inquiryType?: string;
  opportunityId?: string;
  source?: string;
  conversationContext?: string | null;
}

export interface EmailData {
  sanitizedName: string;
  sanitizedEmail: string;
  sanitizedMessage: string;
  sanitizedInquiryType: string;
  opportunityId: string;
  source: string;
  conversationContext: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
