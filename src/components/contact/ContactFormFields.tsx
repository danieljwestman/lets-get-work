
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INQUIRY_TYPES } from '@/constants/inquiryTypes';

interface ContactFormFieldsProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    inquiryType: string;
  };
  onInputChange: (field: string, value: string) => void;
  getFieldError: (field: string) => string;
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  formData,
  onInputChange,
  getFieldError
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Your full name"
            maxLength={100}
            className={getFieldError('name') ? 'border-red-500' : ''}
            required
          />
          {getFieldError('name') && (
            <p className="text-sm text-red-600">{getFieldError('name')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            maxLength={100}
            className={getFieldError('email') ? 'border-red-500' : ''}
            required
          />
          {getFieldError('email') && (
            <p className="text-sm text-red-600">{getFieldError('email')}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => onInputChange('subject', e.target.value)}
          placeholder="What's this about?"
          maxLength={200}
          className={getFieldError('subject') ? 'border-red-500' : ''}
        />
        {getFieldError('subject') && (
          <p className="text-sm text-red-600">{getFieldError('subject')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiryType">Inquiry Type</Label>
        <Select value={formData.inquiryType} onValueChange={(value) => onInputChange('inquiryType', value)}>
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

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => onInputChange('message', e.target.value)}
          placeholder="Tell me about your project, opportunity, or whatever's on your mind..."
          rows={6}
          maxLength={5000}
          className={getFieldError('message') ? 'border-red-500' : ''}
          required
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>{getFieldError('message') && (
            <span className="text-red-600">{getFieldError('message')}</span>
          )}</span>
          <span>{formData.message.length}/5000</span>
        </div>
      </div>
    </>
  );
};
