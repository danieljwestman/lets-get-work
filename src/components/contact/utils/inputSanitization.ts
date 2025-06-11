
import { isValidInquiryType } from '@/constants/inquiryTypes';

// Input sanitization and validation utilities
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .slice(0, 10000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{1,100}$/;
  return nameRegex.test(name.trim());
};

export const validateMessage = (message: string): boolean => {
  const sanitized = sanitizeInput(message);
  return sanitized.length >= 3 && sanitized.length <= 5000; // Changed from 10 to 3 characters minimum
};

export const validateInquiryType = (type: string): boolean => {
  return isValidInquiryType(type);
};
