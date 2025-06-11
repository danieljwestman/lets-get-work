
import { sanitizeInput, validateEmail, validateName, validateMessage, validateInquiryType } from './inputSanitization';

export interface ContactFormData {
  senderName: string;
  senderEmail: string;
  message: string;
  inquiryType: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: ContactFormData;
}

export const validateContactForm = (formData: ContactFormData): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Sanitize inputs
  const sanitizedData: ContactFormData = {
    senderName: sanitizeInput(formData.senderName),
    senderEmail: sanitizeInput(formData.senderEmail).toLowerCase(),
    message: sanitizeInput(formData.message),
    inquiryType: sanitizeInput(formData.inquiryType).toLowerCase()
  };

  // Validate required fields
  if (!sanitizedData.senderName) {
    errors.senderName = 'Name is required';
  } else if (!validateName(sanitizedData.senderName)) {
    errors.senderName = 'Name contains invalid characters or is too long';
  }

  if (!sanitizedData.senderEmail) {
    errors.senderEmail = 'Email is required';
  } else if (!validateEmail(sanitizedData.senderEmail)) {
    errors.senderEmail = 'Please enter a valid email address';
  }

  if (!sanitizedData.message) {
    errors.message = 'Message is required';
  } else if (!validateMessage(sanitizedData.message)) {
    errors.message = 'Message must be between 3 and 5000 characters';
  }

  if (!validateInquiryType(sanitizedData.inquiryType)) {
    errors.inquiryType = 'Invalid inquiry type selected';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: Object.keys(errors).length === 0 ? sanitizedData : undefined
  };
};
