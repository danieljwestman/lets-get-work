
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageDetailModal } from './MessageDetailModal';
import { MessageFilters } from './MessageFilters';
import { MessagesStats } from './MessagesStats';
import { MessageTableView } from './MessageTableView';
import { MessagesPagination } from './MessagesPagination';
import { MessagesHeader } from './MessagesHeader';
import { MessagesLoadingState } from './MessagesLoadingState';
import { MessagesErrorState } from './MessagesErrorState';
import { MessagesEmptyState } from './MessagesEmptyState';
import { MessagesNoMatches } from './MessagesNoMatches';
import { MessagesTimezoneManager } from './MessagesTimezoneManager';
import { MessagesDevModeManager } from './MessagesDevModeManager';
import { getSourceBadge } from './utils/messageUtils';
import { useMessagesTableLogic } from './hooks/useMessagesTableLogic';

export const MessagesContainer: React.FC = () => {
  const {
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
  } = useMessagesTableLogic();

  if (loading || opportunitiesLoading) {
    return <MessagesLoadingState />;
  }

  if (error) {
    return <MessagesErrorState error={error} onRetry={fetchMessages} />;
  }

  return (
    <div className="space-y-6">
      <MessagesHeader 
        onRefresh={fetchMessages}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        opportunities={opportunities}
        timezone={timezone}
      />

      <MessagesStats 
        messages={allMessages} 
        timeRange={timeRange}
        companyFilter={companyFilter}
        timezone={timezone}
      />

      <MessageFilters
        sourceFilter={sourceFilter}
        inquiryFilter={inquiryFilter}
        searchTerm={searchTerm}
        onSourceFilterChange={setSourceFilter}
        onInquiryFilterChange={setInquiryFilter}
        onSearchTermChange={setSearchTerm}
        onClearFilters={handleClearFilters}
      />

      {/* Show empty state only when there are no messages at all */}
      {totalCount === 0 && <MessagesEmptyState />}

      {/* Show messages table when there are messages */}
      {totalCount > 0 && filteredMessages.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <MessageTableView
              messages={filteredMessages}
              onViewMessage={handleViewMessage}
              getSourceBadge={getSourceBadge}
              onMessageDeleted={handleMessageDeleted}
              timezone={timezone}
            />
          </CardContent>
        </Card>
      )}

      {/* Show no matches only when there are messages but filters exclude all */}
      {totalCount > 0 && filteredMessages.length === 0 && hasActiveFilters && <MessagesNoMatches />}

      <MessagesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalCount}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* Timezone Selector with card styling - moved below pagination */}
      <MessagesTimezoneManager 
        timezone={timezone}
        onTimezoneChange={setTimezone}
      />

      {/* Demo manager only in dev mode */}
      <MessagesDevModeManager 
        isDev={isDev}
        onDataChange={fetchMessages}
      />

      <MessageDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        getSourceBadge={getSourceBadge}
        timezone={timezone}
      />
    </div>
  );
};
