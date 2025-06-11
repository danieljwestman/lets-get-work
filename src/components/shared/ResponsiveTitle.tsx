
import React from 'react';
import { useOpportunityTranslations } from '@/hooks/useOpportunityTranslations';

interface ResponsiveTitleProps {
  titleKey: string;
  mobileTitleKey?: string;
  className?: string;
}

export const ResponsiveTitle: React.FC<ResponsiveTitleProps> = ({
  titleKey,
  mobileTitleKey,
  className = ""
}) => {
  const { t } = useOpportunityTranslations();
  
  const title = t(titleKey);
  const mobileTitle = mobileTitleKey ? t(mobileTitleKey) : title;

  return (
    <>
      {/* Mobile title */}
      <h2 className={`block sm:hidden ${className}`}>
        {mobileTitle}
      </h2>
      
      {/* Desktop title */}
      <h2 className={`hidden sm:block ${className}`}>
        {title}
      </h2>
    </>
  );
};
