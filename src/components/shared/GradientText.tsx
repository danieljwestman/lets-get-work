
import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  gradient?: 'primary' | 'secondary' | 'accent';
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

export const GradientText = ({ 
  children, 
  gradient = 'primary', 
  className = '',
  as: Component = 'span'
}: GradientTextProps) => {
  const gradientClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
    accent: 'bg-gradient-to-r from-pink-600 to-blue-600'
  };

  return (
    <Component className={`${gradientClasses[gradient]} bg-clip-text text-transparent ${className}`}>
      {children}
    </Component>
  );
};
