
import { useState, useMemo } from 'react';
import type { Message } from '@/types/admin';

export const useMessageFilters = (
  messages: Message[],
  setCurrentPage: (page: number) => void
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesSearch = !searchTerm || 
        message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSource = sourceFilter === 'all' || message.source === sourceFilter;
      const matchesInquiry = inquiryFilter === 'all' || message.inquiry_type === inquiryFilter;
      const matchesCompany = companyFilter === 'all' || message.opportunity_id === companyFilter;

      return matchesSearch && matchesSource && matchesInquiry && matchesCompany;
    });
  }, [messages, searchTerm, sourceFilter, inquiryFilter, companyFilter]);

  // Reset to first page when filters change
  const setSearchTermWithReset = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const setSourceFilterWithReset = (source: string) => {
    setSourceFilter(source);
    setCurrentPage(1);
  };

  const setInquiryFilterWithReset = (inquiry: string) => {
    setInquiryFilter(inquiry);
    setCurrentPage(1);
  };

  const setCompanyFilterWithReset = (company: string) => {
    setCompanyFilter(company);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm: setSearchTermWithReset,
    sourceFilter,
    setSourceFilter: setSourceFilterWithReset,
    inquiryFilter,
    setInquiryFilter: setInquiryFilterWithReset,
    companyFilter,
    setCompanyFilter: setCompanyFilterWithReset,
    filteredMessages
  };
};
