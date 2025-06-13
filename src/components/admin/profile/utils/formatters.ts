
export const getTimezoneLabel = (value: string, timezoneOptions: Array<{value: string, label: string}>) => {
  const option = timezoneOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

export const formatMemberSince = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatBirthDate = (dateString: string) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
