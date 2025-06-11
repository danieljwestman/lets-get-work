
// Central source of truth for inquiry types across the application
export interface InquiryType {
  value: string;
  label: string;
}

export const INQUIRY_TYPES: InquiryType[] = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'job_opportunity', label: 'Job Opportunity' },
  { value: 'freelance', label: 'Freelance Project' },
  { value: 'speaking', label: 'Speaking Engagement' },
  { value: 'other', label: 'Other' }
];

export const INQUIRY_TYPE_VALUES = INQUIRY_TYPES.map(type => type.value);

export const getInquiryTypeLabel = (value: string): string => {
  const type = INQUIRY_TYPES.find(t => t.value === value);
  return type?.label || value;
};

export const isValidInquiryType = (value: string): boolean => {
  return INQUIRY_TYPE_VALUES.includes(value);
};
