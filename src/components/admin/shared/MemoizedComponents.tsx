
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ThemeCard } from './ThemeCard';
import { OpportunityCard } from './OpportunityCard';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import type { Opportunity } from '@/types/admin';

interface Theme {
  id: string;
  theme_id: string;
  name: string;
  browser_title?: string;
  branding: any;
  content: any;
  danibot: any;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface MemoizedThemeCardProps {
  theme: Theme;
  onEdit: () => void;
  onRefresh: () => void;
  onCopy?: (theme: Theme) => Promise<void>;
  copying?: string | null;
}

interface MemoizedOpportunityCardProps {
  opportunity: Opportunity;
  onEdit: () => void;
  onRefresh: () => void;
  onCopy?: (opportunity: Opportunity) => Promise<void>;
  copying?: string | null;
}

interface MemoizedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

interface MemoizedLoadingStateProps {
  message: string;
}

interface MemoizedErrorStateProps {
  error: string;
  onRetry: () => void;
  retryLabel?: string;
}

export const MemoizedThemeCard = React.memo<MemoizedThemeCardProps>(({ 
  theme, 
  onEdit, 
  onRefresh, 
  onCopy, 
  copying 
}) => (
  <ThemeCard 
    theme={theme} 
    onEdit={onEdit} 
    onRefresh={onRefresh} 
    onCopy={onCopy}
    copying={copying === theme.theme_id}
  />
));

export const MemoizedOpportunityCard = React.memo<MemoizedOpportunityCardProps>(({ 
  opportunity, 
  onEdit, 
  onRefresh, 
  onCopy, 
  copying 
}) => (
  <OpportunityCard 
    opportunity={opportunity} 
    onEdit={onEdit} 
    onRefresh={onRefresh} 
    onCopy={onCopy}
    copying={copying === opportunity.opportunity_id}
  />
));

export const MemoizedEmptyState = React.memo<MemoizedEmptyStateProps>(({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => (
  <EmptyState 
    icon={icon} 
    title={title} 
    description={description} 
    actionLabel={actionLabel} 
    onAction={onAction} 
  />
));

export const MemoizedLoadingState = React.memo<MemoizedLoadingStateProps>(({ message }) => (
  <LoadingState message={message} />
));

export const MemoizedErrorState = React.memo<MemoizedErrorStateProps>(({ 
  error, 
  onRetry, 
  retryLabel 
}) => (
  <ErrorState error={error} onRetry={onRetry} retryLabel={retryLabel} />
));

MemoizedThemeCard.displayName = 'MemoizedThemeCard';
MemoizedOpportunityCard.displayName = 'MemoizedOpportunityCard';
MemoizedEmptyState.displayName = 'MemoizedEmptyState';
MemoizedLoadingState.displayName = 'MemoizedLoadingState';
MemoizedErrorState.displayName = 'MemoizedErrorState';
