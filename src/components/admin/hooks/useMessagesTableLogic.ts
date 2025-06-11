
import { useState, useEffect } from 'react';
import { useMessagesData } from './useMessagesData';
import { useMessageFilters } from './useMessageFilters';
import { useOpportunityOptions } from '../services/opportunityFilterService';
import { useProfile } from '@/hooks/useProfile';
import { domainConfig } from '@/services/domainConfig';
import type { Message } from '@/types/admin';

export const useMessagesTableLogic = () => {
  const [timeRange, setTimeRange] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const { profile } = useProfile();
  const [isDev, setIsDev] = useState<boolean>(false);
  
  const [timezone, setTimezone] = useState<string>(() => {
    // Get from shared localStorage or default to user's preferred timezone or Europe/Stockholm
    return localStorage.getItem('dashboard-timezone') || 
           profile?.timezone || 
           'Europe/Stockholm';
  });

  // Check if we're in dev mode using Supabase ENV
  useEffect(() => {
    const checkDevMode = async () => {
      try {
        const devMode = await domainConfig.isDev();
        setIsDev(devMode);
      } catch (error) {
        console.warn('Failed to check dev mode, defaulting to false:', error);
        setIsDev(false);
      }
    };
    
    checkDevMode();
  }, []);

  // Update timezone when user profile loads with preferred timezone
  useEffect(() => {
    if (profile?.timezone) {
      setTimezone(profile.timezone);
    }
  }, [profile?.timezone]);

  // Save timezone preference to shared localStorage
  useEffect(() => {
    localStorage.setItem('dashboard-timezone', timezone);
  }, [timezone]);

  const {
    messages,
    allMessages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalCount,
    fetchMessages,
    ITEMS_PER_PAGE
  } = useMessagesData(timeRange, companyFilter, timezone);

  const { opportunities, loading: opportunitiesLoading } = useOpportunityOptions();

  const {
    searchTerm,
    setSearchTerm,
    sourceFilter,
    setSourceFilter,
    inquiryFilter,
    setInquiryFilter,
    filteredMessages
  } = useMessageFilters(messages, setCurrentPage);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleMessageDeleted = async () => {
    console.log('Message deleted, refreshing data...');
    await fetchMessages();
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSourceFilter('all');
    setInquiryFilter('all');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || sourceFilter !== 'all' || inquiryFilter !== 'all';

  return {
    // State
    timeRange,
    setTimeRange,
    companyFilter,
    setCompanyFilter,
    timezone,
    setTimezone,
    isDev,
    selectedMessage,
    setSelectedMessage,
    
    // Data
    messages,
    allMessages,
    opportunities,
    filteredMessages,
    
    // Loading states
    loading,
    opportunitiesLoading,
    error,
    
    // Pagination
    currentPage,
    setCurrentPage,
    totalCount,
    totalPages,
    ITEMS_PER_PAGE,
    
    // Filters
    searchTerm,
    setSearchTerm,
    sourceFilter,
    setSourceFilter,
    inquiryFilter,
    setInquiryFilter,
    hasActiveFilters,
    
    // Handlers
    fetchMessages,
    handleMessageDeleted,
    handleViewMessage,
    handleClearFilters
  };
};
