
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { useContactEmail } from './hooks/useContactEmail';
import { emailRateLimit, getClientIdentifier } from '@/utils/advancedRateLimiting';
import { validateEmail, validateName, validateMessage } from '@/utils/inputValidation';
import { useContactFormValidation } from './hooks/useContactFormValidation';
import { ContactFormFields } from './ContactFormFields';
import { ContactFormAlerts } from './ContactFormAlerts';

interface ContactFormProps {
  formData?: {
    name: string;
    email: string;
    subject: string;
    message: string;
    inquiryType: string;
  };
  onInputChange?: (field: string, value: string) => void;
  isLoading?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  formData: externalFormData, 
  onInputChange: externalOnInputChange, 
  isLoading: externalIsLoading 
}) => {
  const [rateLimitError, setRateLimitError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { 
    formData: internalFormData, 
    handleInputChange: internalHandleInputChange,
    sendEmail, 
    isLoading: hookIsLoading 
  } = useContactEmail();
  
  const { validateForm, clearFieldError, getFieldError } = useContactFormValidation();

  // Use external props if provided, otherwise use internal state
  const formData = externalFormData ? {
    senderName: externalFormData.name,
    senderEmail: externalFormData.email,
    message: externalFormData.message,
    inquiryType: externalFormData.inquiryType
  } : internalFormData;
  
  const onInputChange = externalOnInputChange || internalHandleInputChange;
  const loading = externalIsLoading !== undefined ? externalIsLoading : hookIsLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError('');
    setError('');
    setSuccess(false);

    // Rate limiting check
    const clientId = getClientIdentifier();
    const rateLimitResult = emailRateLimit.check(clientId);
    
    if (!rateLimitResult.allowed) {
      setRateLimitError('Too many messages sent. Please wait before sending another message.');
      return;
    }

    // Validate form - convert ContactFormData to expected format
    const validationData = {
      name: formData.senderName,
      email: formData.senderEmail,
      subject: `Contact from ${formData.senderName}`,
      message: formData.message
    };
    
    if (!validateForm(validationData)) {
      return;
    }

    // Sanitize and prepare data
    const emailValidation = validateEmail(formData.senderEmail);
    const nameValidation = validateName(formData.senderName);
    const messageValidation = validateMessage(formData.message);

    if (!emailValidation.isValid || !nameValidation.isValid || !messageValidation.isValid) {
      return;
    }

    try {
      await sendEmail(formData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const handleInputChangeWrapper = (field: string, value: string) => {
    onInputChange(field, value);
    clearFieldError(field);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Get In Touch
        </CardTitle>
        <CardDescription>
          Send me a message and I'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ContactFormAlerts 
          success={success}
          error={error}
          rateLimitError={rateLimitError}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <ContactFormFields
            formData={{
              name: formData.senderName,
              email: formData.senderEmail,
              subject: '',
              message: formData.message,
              inquiryType: formData.inquiryType
            }}
            onInputChange={(field, value) => {
              const mappedField = field === 'name' ? 'senderName' : field === 'email' ? 'senderEmail' : field;
              handleInputChangeWrapper(mappedField, value);
            }}
            getFieldError={getFieldError}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center">
          All messages are encrypted and handled securely. Your information will never be shared.
        </p>
      </CardContent>
    </Card>
  );
};
