
import { useMemo, useEffect } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { createThemeFromOpportunity } from '@/utils/themeGenerator';

export const useTheme = () => {
  const { opportunity } = useOpportunity();
  
  const theme = useMemo(() => {
    return createThemeFromOpportunity(opportunity);
  }, [opportunity]);
  
  useEffect(() => {
    // Apply theme variables when theme changes
    theme.apply();
  }, [theme]);
  
  return {
    tokens: theme.tokens,
    cssVariables: theme.cssVariables,
    classes: theme.themeClasses,
    applyTheme: theme.apply
  };
};

// Hook for accessing specific theme values
export const useThemeValue = () => {
  const { tokens } = useTheme();
  
  return {
    // Color utilities
    getPrimaryColor: () => tokens.colors.primary,
    getSecondaryColor: () => tokens.colors.secondary,
    getAccentColor: () => tokens.colors.accent,
    
    // Gradient utilities
    getHeroGradient: () => tokens.gradients.hero,
    getPrimaryGradient: () => tokens.gradients.primary,
    getSecondaryGradient: () => tokens.gradients.secondary,
    
    // Typography utilities
    getTitleClasses: (mobile = false) => mobile ? tokens.typography.title.mobile : tokens.typography.title.desktop,
    getSubtitleClasses: (mobile = false) => mobile ? tokens.typography.subtitle.mobile : tokens.typography.subtitle.desktop,
    getBodyClasses: (mobile = false) => mobile ? tokens.typography.body.mobile : tokens.typography.body.desktop,
    
    // Animation utilities
    getHoverAnimation: () => tokens.animations.hover,
    getButtonAnimation: () => tokens.animations.button,
    getCardAnimation: () => tokens.animations.card,
  };
};
