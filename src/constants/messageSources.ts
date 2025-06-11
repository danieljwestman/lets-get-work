
// Central source of truth for message sources across the application
export interface MessageSource {
  value: string;
  label: string;
}

export const MESSAGE_SOURCES: MessageSource[] = [
  { value: 'contact_form', label: 'Contact Form' },
  { value: 'assistant', label: 'Assistant' }
];

export const MESSAGE_SOURCE_VALUES = MESSAGE_SOURCES.map(source => source.value);

export const getMessageSourceLabel = (value: string): string => {
  const source = MESSAGE_SOURCES.find(s => s.value === value);
  return source?.label || value;
};

export const isValidMessageSource = (value: string): boolean => {
  return MESSAGE_SOURCE_VALUES.includes(value);
};
