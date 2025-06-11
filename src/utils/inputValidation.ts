
import DOMPurify from 'isomorphic-dompurify';
import { logValidationError } from './securityMonitoring';

// Enhanced input validation with security logging
export interface ValidationResult {
  isValid: boolean;
  sanitized?: string;
  errors: string[];
}

export interface ValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowedChars?: RegExp;
  stripHtml?: boolean;
  required?: boolean;
}

export const validateAndSanitizeInput = (
  input: unknown,
  fieldName: string,
  options: ValidationOptions = {}
): ValidationResult => {
  const {
    maxLength = 1000,
    minLength = 0,
    allowedChars,
    stripHtml = true,
    required = true
  } = options;

  const errors: string[] = [];

  // Type check
  if (typeof input !== 'string') {
    if (required) {
      errors.push(`${fieldName} must be a string`);
    }
    logValidationError({ field: fieldName, error: 'Invalid type', value: typeof input });
    return { isValid: false, errors };
  }

  let sanitized = input.trim();

  // Required check
  if (required && !sanitized) {
    errors.push(`${fieldName} is required`);
    logValidationError({ field: fieldName, error: 'Required field empty' });
    return { isValid: false, errors };
  }

  // Length validation
  if (sanitized.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters`);
  }

  if (sanitized.length > maxLength) {
    errors.push(`${fieldName} must not exceed ${maxLength} characters`);
    logValidationError({ 
      field: fieldName, 
      error: 'Length exceeded', 
      actual: sanitized.length, 
      max: maxLength 
    });
  }

  // Character validation
  if (allowedChars && !allowedChars.test(sanitized)) {
    errors.push(`${fieldName} contains invalid characters`);
    logValidationError({ field: fieldName, error: 'Invalid characters detected' });
  }

  // HTML sanitization
  if (stripHtml) {
    const originalLength = sanitized.length;
    sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
    
    if (sanitized.length !== originalLength) {
      logValidationError({ 
        field: fieldName, 
        error: 'HTML content stripped',
        originalLength,
        sanitizedLength: sanitized.length
      });
    }
  }

  // SQL injection pattern detection
  const sqlPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i,
    /(['"];\s*--|\/\*|\*\/)/,
    /(xp_|sp_)/i
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(sanitized)) {
      errors.push(`${fieldName} contains potentially malicious content`);
      logValidationError({ 
        field: fieldName, 
        error: 'SQL injection pattern detected',
        pattern: pattern.toString()
      });
      break;
    }
  }

  // XSS pattern detection
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      errors.push(`${fieldName} contains potentially malicious content`);
      logValidationError({ 
        field: fieldName, 
        error: 'XSS pattern detected',
        pattern: pattern.toString()
      });
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    sanitized: errors.length === 0 ? sanitized : undefined,
    errors
  };
};

// Email validation with enhanced security
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    logValidationError({ field: 'email', error: 'Invalid format', value: email });
    return { isValid: false, errors: ['Invalid email format'] };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\+.*\+/, // Multiple plus signs
    /\.{2,}/, // Multiple consecutive dots
    /@.*@/, // Multiple @ symbols
    /[<>]/  // Angle brackets
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) {
      logValidationError({ 
        field: 'email', 
        error: 'Suspicious pattern detected',
        pattern: pattern.toString()
      });
      return { isValid: false, errors: ['Invalid email format'] };
    }
  }

  return { isValid: true, sanitized: email.toLowerCase().trim(), errors: [] };
};

// Message content validation
export const validateMessage = (message: string): ValidationResult => {
  return validateAndSanitizeInput(message, 'message', {
    maxLength: 5000,
    minLength: 10,
    stripHtml: true,
    required: true
  });
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  return validateAndSanitizeInput(name, 'name', {
    maxLength: 100,
    minLength: 1,
    allowedChars: /^[a-zA-ZÀ-ÿ\s\-'\.]+$/,
    stripHtml: true,
    required: true
  });
};
