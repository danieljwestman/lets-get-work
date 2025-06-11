
import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { formatConversationContext } from './utils/conversationFormatter';
import { INQUIRY_TYPES } from '@/constants/inquiryTypes';
import type { EmailCompositionData } from '@/types/chat';

interface EmailComposerProps {
  initialData?: EmailCompositionData;
  conversationContext?: string;
  onEmailSent?: () => void;
  onCancel?: () => void;
  showSuccessToast?: boolean; // Controls whether to show toast (default true for backward compatibility)
}

export const EmailComposer: React.FC<EmailComposerProps> = ({ 
  initialData, 
  conversationContext, 
  onEmailSent, 
  onCancel,
  showSuccessToast = true // Default to true for backward compatibility
}) => {
  const [formData, setFormData] = useState<EmailCompositionData>({
    senderName: '',
    senderEmail: '',
    subject: initialData?.subject || '',
    content: initialData?.content || '',
    inquiryType: initialData?.inquiryType || 'general'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { toast } = useToast();
  const { opportunity } = useOpportunity();

  const handleInputChange = (field: keyof EmailCompositionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendEmail = async () => {
    if (!formData.senderName || !formData.senderEmail || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Prevent multiple submissions
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const formattedContext = conversationContext ? formatConversationContext(conversationContext) : '';
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          subject: `Contact from ${formData.senderName}`,
          message: formData.content,
          inquiryType: formData.inquiryType,
          conversationContext: formattedContext,
          opportunityId: opportunity?.opportunity_id || 'default',
          source: 'assistant' // Use 'assistant' instead of 'danibot_composer'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Only show toast if showSuccessToast is true
      if (showSuccessToast) {
        toast({
          title: "Email Sent Successfully! ✨",
          description: "Daniel will get back to you soon. Check your email for a confirmation.",
          variant: "success"
        });
      }

      // Auto-close the composer after successful send
      setIsHidden(true);
      onEmailSent?.();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to Send Email",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hide the composer if email was sent successfully
  if (isHidden) {
    return null;
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-blue-600" />
          Compose Email to Daniel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name *</label>
            <Input
              placeholder="Your full name"
              value={formData.senderName}
              onChange={(e) => handleInputChange('senderName', e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Your Email *</label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={formData.senderEmail}
              onChange={(e) => handleInputChange('senderEmail', e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Inquiry Type</label>
          <Select
            value={formData.inquiryType}
            onValueChange={(value) => handleInputChange('inquiryType', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <Textarea
            placeholder="Your message to Daniel..."
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="w-full min-h-[120px] resize-y"
            disabled={isLoading}
          />
        </div>

        {conversationContext && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-1">
              💬 Conversation context will be included
            </p>
            <p className="text-xs text-blue-600">
              This helps Daniel understand what you discussed with DaniBot
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Email'}
          </Button>
          
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
