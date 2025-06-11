
// Central source of truth for opportunity statuses across the application
export interface OpportunityStatus {
  value: string;
  label: string;
}

export const OPPORTUNITY_STATUSES: OpportunityStatus[] = [
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
];

export const OPPORTUNITY_STATUS_VALUES = OPPORTUNITY_STATUSES.map(status => status.value);

export const getOpportunityStatusLabel = (value: string): string => {
  const status = OPPORTUNITY_STATUSES.find(s => s.value === value);
  return status?.label || value;
};

export const isValidOpportunityStatus = (value: string): boolean => {
  return OPPORTUNITY_STATUS_VALUES.includes(value);
};

export type OpportunityStatusType = 'unpublished' | 'published' | 'archived';
