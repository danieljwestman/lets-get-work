
import React from 'react';
import { DESIGN_SYSTEM } from '@/constants/designSystem';
import { ResponsiveContainer } from './ResponsiveContainer';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  background?: 'default' | 'gradient' | 'muted';
  size?: 'default' | 'small' | 'large';
  containerSize?: 'default' | 'small' | 'large';
}

export const Section = ({ 
  children, 
  id,
  className = '',
  background = 'default',
  size = 'default',
  containerSize = 'default'
}: SectionProps) => {
  const sizeClasses = {
    default: DESIGN_SYSTEM.spacing.section,
    small: DESIGN_SYSTEM.spacing.sectionSmall,
    large: 'px-4 sm:px-6 py-16 sm:py-24'
  };

  const backgroundClasses = {
    default: '',
    gradient: 'bg-gradient-to-b from-white to-purple-50/30',
    muted: 'bg-white/30 backdrop-blur-sm'
  };

  return (
    <section 
      id={id} 
      className={`${sizeClasses[size]} ${backgroundClasses[background]} ${className}`}
    >
      <ResponsiveContainer size={containerSize}>
        {children}
      </ResponsiveContainer>
    </section>
  );
};
