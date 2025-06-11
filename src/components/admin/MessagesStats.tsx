

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, Bot, MessageSquare } from 'lucide-react';
import { getTimezoneAwareDateFilter } from '@/components/analytics/utils/timezoneUtils';
import type { TimeRange } from '@/components/analytics/types/analytics';

interface SentMessage {
  id: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  subject: string | null;
  message: string;
  inquiry_type: string;
  source: string;
  conversation_context: string | null;
  email_sent_successfully: boolean;
  email_id: string | null;
  user_agent: string | null;
  ip_address: unknown;
  opportunity_id: string;
}

interface MessagesStatsProps {
  messages: SentMessage[];
  timeRange: string;
  companyFilter: string;
  timezone: string;
}

const getDateFilter = (timeRange: string) => {
  if (timeRange === 'all') return null;
  
  const now = new Date();
  const startDate = new Date();
  
  switch (timeRange) {
    case '1h':
      startDate.setHours(now.getHours() - 1);
      break;
    case '1d':
      startDate.setDate(now.getDate() - 1);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return null;
  }
  
  return startDate;
};

export const MessagesStats: React.FC<MessagesStatsProps> = ({ 
  messages, 
  timeRange, 
  companyFilter,
  timezone 
}) => {
  // Filter messages based on timeRange and companyFilter using timezone-aware filtering
  const filteredMessages = messages.filter(message => {
    const matchesCompany = companyFilter === 'all' || message.opportunity_id === companyFilter;
    
    // Filter by time range using timezone-aware date filter
    const dateFilter = getTimezoneAwareDateFilter(timeRange as TimeRange, timezone);
    const matchesTimeRange = !dateFilter || new Date(message.created_at) >= new Date(dateFilter);
    
    return matchesCompany && matchesTimeRange;
  });

  const totalMessages = filteredMessages.length;
  const successfulSends = filteredMessages.filter(m => m.email_sent_successfully).length;
  const assistantMessages = filteredMessages.filter(m => m.source === 'assistant').length;
  const contactFormMessages = filteredMessages.filter(m => m.source === 'contact_form').length;

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '1h': return 'Last hour';
      case '1d': return 'Last day';
      case '30d': return 'Last 30 days';
      case '1y': return 'Last year';
      case 'all': return 'All time';
      default: return range;
    }
  };

  const stats = [
    {
      title: 'Total Messages',
      value: totalMessages,
      subtitle: getTimeRangeLabel(timeRange),
      icon: Mail,
      borderColor: 'border-l-blue-500',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Successful Sends',
      value: successfulSends,
      subtitle: `${totalMessages > 0 ? Math.round((successfulSends / totalMessages) * 100) : 0}% success rate`,
      icon: CheckCircle,
      borderColor: 'border-l-green-500',
      textColor: 'text-green-600',
      iconColor: 'text-green-500'
    },
    {
      title: 'DaniBot Messages',
      value: assistantMessages,
      subtitle: 'AI conversations',
      icon: Bot,
      borderColor: 'border-l-purple-500',
      textColor: 'text-purple-600',
      iconColor: 'text-purple-500'
    },
    {
      title: 'Contact Form',
      value: contactFormMessages,
      subtitle: 'Direct submissions',
      icon: MessageSquare,
      borderColor: 'border-l-orange-500',
      textColor: 'text-orange-600',
      iconColor: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className={`${stat.borderColor} border-l-4`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

