
import React from 'react';
import { Button } from '@/components/ui/button';
import { DESIGN_SYSTEM } from '@/constants/designSystem';
import { LucideIcon } from 'lucide-react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  animation?: 'hover' | 'hoverRotate' | 'hoverRotateNeg' | 'button';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  gradient?: 'primary' | 'secondary' | 'none';
}

export const AnimatedButton = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  animation = 'button',
  icon: Icon,
  iconPosition = 'left',
  gradient = 'none'
}: AnimatedButtonProps) => {
  const animationClass = DESIGN_SYSTEM.animations[animation];
  
  const gradientClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
    none: ''
  };

  const finalClassName = `${animationClass} ${gradientClasses[gradient]} ${className}`;

  return (
    <Button
      onClick={onClick}
      variant={gradient !== 'none' ? undefined : variant}
      size={size}
      className={finalClassName}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />}
    </Button>
  );
};
