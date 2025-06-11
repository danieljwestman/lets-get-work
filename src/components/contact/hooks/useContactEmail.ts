
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContactFormData } from '../utils/formValidation';
import { MESSAGE_SOURCE_VALUES } from '@/constants/messageSources';

export const useContactEmail = (opportunityId: string = 'default') => {
  const [formData, setFormData] = useState<ContactFormData>({
    senderName: '',
    senderEmail: '',
    message: '',
    inquiryType: 'general'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sendEmail = async (formDataToSend?: ContactFormData) => {
    const dataToSend = formDataToSend || formData;
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('useContactEmail: Starting email send process...');
      console.log('useContactEmail: Opportunity ID:', opportunityId);
      console.log('useContactEmail: Form data:', {
        senderName: dataToSend.senderName,
        senderEmail: dataToSend.senderEmail,
        inquiryType: dataToSend.inquiryType
      });

      // Use centralized source constant
      const sourceValue = MESSAGE_SOURCE_VALUES.includes('contact_form') ? 'contact_form' : MESSAGE_SOURCE_VALUES[0];

      // Call the send-email edge function - it handles everything including database saving
      const { data, error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          senderName: dataToSend.senderName,
          senderEmail: dataToSend.senderEmail,
          message: dataToSend.message,
          inquiryType: dataToSend.inquiryType,
          opportunityId: opportunityId,
          source: sourceValue
        },
      });

      console.log('useContactEmail: Edge function response:', { data, error: emailError });

      if (emailError) {
        console.error('useContactEmail: Edge function error:', emailError);
        
        // Handle configuration errors specifically
        if (emailError.message?.includes('Configuration Error') || emailError.message?.includes('Missing required environment variables')) {
          throw new Error('System configuration error. Please contact the administrator to configure the required environment variables.');
        }
        
        throw new Error(emailError.message || 'Failed to send email');
      }

      // Check if the response contains an error (when edge function returns 500 but supabase doesn't throw)
      if (data?.error) {
        console.error('useContactEmail: Edge function returned error:', data);
        
        if (data.error === 'Configuration Error') {
          throw new Error('System configuration error. Please contact the administrator to configure the required environment variables.');
        }
        
        throw new Error(data.message || data.error || 'Failed to send email');
      }

      console.log('useContactEmail: Email sent successfully');
      setSuccess(true);

      // Reset form data if using internal state
      if (!formDataToSend) {
        setFormData({
          senderName: '',
          senderEmail: '',
          message: '',
          inquiryType: 'general'
        });
      }

    } catch (err: any) {
      console.error('useContactEmail: Error in send process:', err);
      setError(err.message || 'Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    await sendEmail();
    return success;
  };

  return { 
    formData,
    handleInputChange,
    sendEmail, 
    handleSendEmail,
    isLoading, 
    error, 
    success 
  };
};
