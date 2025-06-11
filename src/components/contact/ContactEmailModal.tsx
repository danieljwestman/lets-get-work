
import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useToast } from '@/hooks/use-toast';
import { useContactEmail } from './hooks/useContactEmail';
import { validateContactForm } from './utils/formValidation';
import { emailRateLimit, getClientIdentifier } from '@/utils/advancedRateLimiting';

interface ContactEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactEmailModal: React.FC<ContactEmailModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { trackButtonClick } = useAnalytics();
  const { toast } = useToast();
  const { formData, isLoading, handleInputChange, sendEmail } = useContactEmail();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSendEmailAndClose = async () => {
    console.log('Attempting to send email with data:', {
      name: formData.senderName,
      email: formData.senderEmail,
      messageLength: formData.message.length,
      inquiryType: formData.inquiryType
    });

    // Clear previous errors
    setValidationErrors({});

    // Rate limiting check
    const clientId = getClientIdentifier();
    const rateLimitResult = emailRateLimit.check(clientId);
    
    if (!rateLimitResult.allowed) {
      setValidationErrors({ general: 'Too many requests. Please wait before sending another message.' });
      return;
    }

    // Validate form
    const validationResult = validateContactForm(formData);
    if (!validationResult.isValid) {
      console.log('Validation failed:', validationResult.errors);
      setValidationErrors(validationResult.errors);
      return;
    }

    console.log('Validation passed, sending email...');
    try {
      await sendEmail();
      console.log('Email sent successfully, showing toast and closing modal');
      
      // Show success toast
      toast({
        title: "Email Sent Successfully! ✨",
        description: "Daniel will get back to you soon. Check your email for a confirmation.",
        variant: "success"
      });
      
      onClose();
    } catch (error) {
      console.log('Email sending failed');
      setValidationErrors({ general: 'Failed to send email. Please try again.' });
    }
  };

  const handleModalClose = () => {
    trackButtonClick('close_contact_modal');
    setValidationErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px] mx-auto max-h-[calc(100vh-2rem)] my-4 overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-blue-600" />
            {t('contact.modal.title', 'Contact Daniel')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {validationErrors.general && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {validationErrors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Full Name *</Label>
              <Input
                id="senderName"
                type="text"
                value={formData.senderName}
                onChange={(e) => handleInputChange('senderName', e.target.value)}
                placeholder="Your full name"
                maxLength={100}
                className={validationErrors.senderName ? 'border-red-500' : ''}
                required
              />
              {validationErrors.senderName && (
                <p className="text-sm text-red-600">{validationErrors.senderName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email Address *</Label>
              <Input
                id="senderEmail"
                type="email"
                value={formData.senderEmail}
                onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                placeholder="your.email@example.com"
                maxLength={100}
                className={validationErrors.senderEmail ? 'border-red-500' : ''}
                required
              />
              {validationErrors.senderEmail && (
                <p className="text-sm text-red-600">{validationErrors.senderEmail}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiryType">Inquiry Type</Label>
            <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="collaboration">Collaboration</SelectItem>
                <SelectItem value="job_opportunity">Job Opportunity</SelectItem>
                <SelectItem value="freelance">Freelance Project</SelectItem>
                <SelectItem value="speaking">Speaking Engagement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.inquiryType && (
              <p className="text-sm text-red-600">{validationErrors.inquiryType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell me about your project, opportunity, or whatever's on your mind..."
              rows={6}
              maxLength={5000}
              className={validationErrors.message ? 'border-red-500' : ''}
              required
            />
            <div className="flex justify-between text-sm text-gray-500">
              {validationErrors.message && (
                <span className="text-red-600">{validationErrors.message}</span>
              )}
              <span className="ml-auto">{formData.message.length}/5000</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSendEmailAndClose}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Send className="h-4 w-4 mr-2" />
          {isLoading ? t('contact.form.sending', 'Sending...') : t('contact.buttons.email', 'Send Email')}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          All messages are encrypted and handled securely. Your information will never be shared.
        </p>
      </DialogContent>
    </Dialog>
  );
};
