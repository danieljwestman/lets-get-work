
import type { Theme } from './theme';
import type { OpportunityStatusType } from '@/constants/opportunityStatuses';

export interface Opportunity {
  id: string;
  opportunity_id: string;
  name: string;
  theme_id: string;
  company_name?: string;
  contact_person?: string;
  target_role?: string;
  notes?: string;
  status: OpportunityStatusType;
  user_id?: string;
  is_passcode_protected?: boolean;
  access_passcode?: string;
  owner_full_name?: string;
  created_at?: string;
  updated_at?: string;
  profile_id?: string; // Add profile_id to identify which profile this opportunity belongs to
}

export interface OpportunityWithTheme extends Opportunity {
  theme: Theme;
}

export interface OpportunityContextType {
  opportunity: OpportunityWithTheme | null;
  isLoading: boolean;
  error: string | null;
}

// Re-export Theme from theme types for convenience
export type { Theme } from './theme';
