
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getTimezoneAwareDateFilter } from '@/components/analytics/utils/timezoneUtils';
import { useProfile } from '@/hooks/useProfile';
import type { Message } from '@/types/admin';
import type { TimeRange } from '@/components/analytics/types/analytics';

const ITEMS_PER_PAGE = 10;

export const useMessagesData = (timeRange?: string, companyFilter?: string, timezone?: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Use provided timezone or fallback to user's preferred timezone
  const effectiveTimezone = timezone || profile?.timezone || 'Europe/Stockholm';

  const fetchMessages = async () => {
    if (!user) {
      setMessages([]);
      setAllMessages([]);
      setLoading(false);
      return;
    }

    console.log('🔄 Starting to fetch messages for user:', user.id);
    setLoading(true);
    setError(null);
    
    try {
      console.log('✅ User authenticated, proceeding with data fetch...');
      
      // Calculate timezone-aware date filter
      const dateFilter = getTimezoneAwareDateFilter(timeRange as TimeRange || 'all', effectiveTimezone);

      // Build query for all messages - RLS automatically filters to user's messages
      let allQuery = supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id) // Explicit filter for clarity
        .order('created_at', { ascending: false });

      // Apply time filter if specified
      if (dateFilter) {
        allQuery = allQuery.gte('created_at', dateFilter);
      }

      // Apply company filter if specified (this is actually opportunity filter)
      if (companyFilter && companyFilter !== 'all') {
        allQuery = allQuery.eq('opportunity_id', companyFilter);
      }

      const { data: allData, error: allError } = await allQuery;

      if (allError) {
        console.error('❌ Supabase fetch error for all messages:', allError);
        throw new Error(`Failed to fetch messages: ${allError.message}`);
      }

      setAllMessages(allData || []);
      
      // Calculate offset for pagination
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      
      // Build query for paginated messages - same approach as above
      let paginatedQuery = supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id) // Explicit filter for clarity
        .order('created_at', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      // Apply same filters to paginated query
      if (dateFilter) {
        paginatedQuery = paginatedQuery.gte('created_at', dateFilter);
      }

      if (companyFilter && companyFilter !== 'all') {
        paginatedQuery = paginatedQuery.eq('opportunity_id', companyFilter);
      }

      const { data, error: fetchError, count } = await paginatedQuery;

      console.log('📊 Supabase response:', {
        data: data,
        error: fetchError,
        count: count,
        dataLength: data?.length,
        firstItem: data?.[0]
      });

      if (fetchError) {
        console.error('❌ Supabase fetch error:', fetchError);
        throw new Error(`Failed to fetch paginated messages: ${fetchError.message}`);
      }

      console.log('✅ Successfully fetched messages:', data?.length || 0);
      setMessages(data || []);
      setTotalCount(count || 0);
      
      if (data && data.length > 0) {
        console.log('📋 Sample message data:', {
          id: data[0].id,
          sender: data[0].sender_name,
          email: data[0].sender_email,
          source: data[0].source,
          opportunity_id: data[0].opportunity_id,
          user_id: data[0].user_id,
          created: data[0].created_at
        });
      }
    } catch (error: any) {
      console.error('💥 Error fetching messages:', error);
      setError(error.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, timeRange, companyFilter, user, effectiveTimezone]);

  return {
    messages,
    allMessages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalCount,
    fetchMessages,
    ITEMS_PER_PAGE
  };
};

export type { Message };
