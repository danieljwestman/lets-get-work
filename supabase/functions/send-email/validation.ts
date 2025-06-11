
import { ValidationResult } from './types.ts';

// Inquiry types - kept in sync with src/constants/inquiryTypes.ts
const INQUIRY_TYPE_VALUES = ['general', 'collaboration', 'job_opportunity', 'freelance', 'speaking', 'other'];

// Message sources - kept in sync with src/constants/messageSources.ts
const MESSAGE_SOURCE_VALUES = ['contact_form', 'assistant'];

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input) return ''
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .slice(0, 10000)
}

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{1,100}$/
  return nameRegex.test(name.trim())
}

export const validateMessage = (message: string): boolean => {
  const sanitized = sanitizeInput(message)
  return sanitized.length >= 3 && sanitized.length <= 5000
}

export const validateInquiryType = (inquiryType: string): boolean => {
  // Use centralized inquiry types for validation
  return INQUIRY_TYPE_VALUES.includes(inquiryType.toLowerCase())
}

export const validateMessageSource = (source: string): boolean => {
  // Use centralized message sources for validation
  return MESSAGE_SOURCE_VALUES.includes(source.toLowerCase())
}

export const validateEmailRequest = (body: any): ValidationResult => {
  const { senderName, senderEmail, message, inquiryType = 'general', source = 'contact_form' } = body

  // Check required fields
  if (!senderName || !senderEmail || !message) {
    return { isValid: false, error: 'Missing required fields' }
  }

  const sanitizedName = sanitizeInput(senderName)
  const sanitizedEmail = sanitizeInput(senderEmail).toLowerCase()
  const sanitizedMessage = sanitizeInput(message)
  const sanitizedInquiryType = sanitizeInput(inquiryType).toLowerCase()
  const sanitizedSource = sanitizeInput(source).toLowerCase()

  // Validate inputs
  if (!validateName(sanitizedName)) {
    return { isValid: false, error: 'Invalid name format' }
  }

  if (!validateEmail(sanitizedEmail)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  if (!validateMessage(sanitizedMessage)) {
    return { isValid: false, error: 'Message must be between 3 and 5000 characters' }
  }

  if (!validateInquiryType(sanitizedInquiryType)) {
    return { isValid: false, error: 'Invalid inquiry type' }
  }

  if (!validateMessageSource(sanitizedSource)) {
    return { isValid: false, error: 'Invalid message source' }
  }

  return { isValid: true }
}
