import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, Bot, MessageSquare, Briefcase, Users, Code, Mic, HelpCircle } from 'lucide-react';
import { getInquiryTypeLabel } from '@/constants/inquiryTypes';
import { getMessageSourceLabel } from '@/constants/messageSources';
import type { Message } from '@/types/admin';

export const getSourceLabel = (source: string): string => {
  return getMessageSourceLabel(source);
};

export const getSourceIcon = (source: string) => {
  switch (source) {
    case 'contact_form':
      return <Mail className="w-3 h-3" />;
    case 'assistant':
      return <Bot className="w-3 h-3" />;
    default:
      return <MessageSquare className="w-3 h-3" />;
  }
};

export const getSourceBadge = (source: string) => {
  const label = getSourceLabel(source);
  const icon = getSourceIcon(source);
  
  // Make contact form badge more subtle
  const variant = source === 'contact_form' ? 'outline' : 'secondary';
  const customClass = source === 'contact_form' 
    ? 'border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-100/50' 
    : '';
  
  return (
    <Badge variant={variant} className={`flex items-center gap-1 ${customClass}`}>
      {icon}
      {label}
    </Badge>
  );
};

export const getInquiryTypeIcon = (type: string) => {
  switch (type) {
    case 'job_opportunity':
      return <Briefcase className="w-3 h-3" />;
    case 'collaboration':
      return <Users className="w-3 h-3" />;
    case 'freelance':
      return <Code className="w-3 h-3" />;
    case 'speaking':
      return <Mic className="w-3 h-3" />;
    case 'general':
    case 'other':
      return <HelpCircle className="w-3 h-3" />;
    default:
      return <HelpCircle className="w-3 h-3" />;
  }
};

export const getInquiryTypeBadge = (type: string) => {
  const label = getInquiryTypeLabel(type);
  const icon = getInquiryTypeIcon(type);
  
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  
  switch (type) {
    case 'job_opportunity':
      variant = 'default';
      break;
    case 'collaboration':
      variant = 'secondary';
      break;
    case 'freelance':
      variant = 'outline';
      break;
    default:
      variant = 'outline';
      break;
  }
  
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      {icon}
      {label}
    </Badge>
  );
};

export const formatMessageDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStatusColor = (emailSent: boolean): string => {
  return emailSent ? 'text-green-600' : 'text-yellow-600';
};

export const getStatusLabel = (emailSent: boolean): string => {
  return emailSent ? 'Sent' : 'Pending';
};
