
import { useState, useRef } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';

export interface OpportunityState {
  opportunity: OpportunityWithTheme | null;
  isLoading: boolean;
  error: string | null;
  lastSubdomain: string | null;
  currentRequestId: string;
}

export const useOpportunityState = () => {
  const [opportunity, setOpportunity] = useState<OpportunityWithTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastSubdomain = useRef<string | null>(null);
  const currentRequestId = useRef<string>('');

  const updateState = (updates: Partial<OpportunityState>) => {
    if (updates.opportunity !== undefined) setOpportunity(updates.opportunity);
    if (updates.isLoading !== undefined) setIsLoading(updates.isLoading);
    if (updates.error !== undefined) setError(updates.error);
    if (updates.lastSubdomain !== undefined) lastSubdomain.current = updates.lastSubdomain;
    if (updates.currentRequestId !== undefined) currentRequestId.current = updates.currentRequestId;
  };

  const resetState = () => {
    setOpportunity(null);
    setIsLoading(true);
    setError(null);
    lastSubdomain.current = null;
    currentRequestId.current = '';
  };

  return {
    state: {
      opportunity,
      isLoading,
      error,
      lastSubdomain: lastSubdomain.current,
      currentRequestId: currentRequestId.current
    },
    updateState,
    resetState,
    refs: {
      lastSubdomain,
      currentRequestId
    }
  };
};
