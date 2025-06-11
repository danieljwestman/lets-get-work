
import { useState } from 'react';
import { validateEmail, validateName, validateMessage } from '@/utils/inputValidation';
import { logValidationError } from '@/utils/securityMonitoring';
import { getClientIdentifier } from '@/utils/advancedRateLimiting';

interface ValidationErrors {
  [key: string]: string[];
}

export const useContactFormValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = (formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): boolean => {
    const errors: ValidationErrors = {};
    
    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.errors;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors;
    }

    // Validate message
    const messageValidation = validateMessage(formData.message);
    if (!messageValidation.isValid) {
      errors.message = messageValidation.errors;
    }

    // Validate subject (optional but if provided, should be reasonable)
    if (formData.subject) {
      if (formData.subject.length > 200) {
        errors.subject = ['Subject must not exceed 200 characters'];
      }
      if (formData.subject.trim().length < 3) {
        errors.subject = ['Subject must be at least 3 characters'];
      }
    }

    setValidationErrors(errors);
    
    // Log validation failures for security monitoring
    if (Object.keys(errors).length > 0) {
      logValidationError({
        form: 'contact_form',
        errors: Object.keys(errors),
        client_id: getClientIdentifier()
      });
    }
    
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getFieldError = (field: string): string => {
    return validationErrors[field]?.[0] || '';
  };

  return {
    validationErrors,
    validateForm,
    clearFieldError,
    getFieldError
  };
};
