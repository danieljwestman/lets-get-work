
import React from 'react';
import { DESIGN_SYSTEM } from '@/constants/designSystem';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'small' | 'large';
}

export const ResponsiveContainer = ({ 
  children, 
  className = '', 
  size = 'default' 
}: ResponsiveContainerProps) => {
  const sizeClasses = {
    default: DESIGN_SYSTEM.spacing.container,
    small: 'mx-auto max-w-2xl px-4 sm:px-0',
    large: 'mx-auto max-w-6xl px-4 sm:px-0'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
