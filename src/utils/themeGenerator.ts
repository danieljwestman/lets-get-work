import { DesignTokens } from '@/types/design';
import { OpportunityWithTheme } from '@/types/opportunity';
import { ThemeConfig } from '@/types/theme';
import { DESIGN_SYSTEM, DEFAULT_DESIGN_TOKENS } from '@/constants/designSystem';

// Generate comprehensive CSS variables from design tokens
export const generateCSSVariables = (tokens: DesignTokens): Record<string, string> => {
  return {
    // Color variables
    '--color-primary': tokens.colors.primary,
    '--color-secondary': tokens.colors.secondary,
    '--color-accent': tokens.colors.accent,
    
    // Gradient variables (for CSS gradients)
    '--gradient-hero': `linear-gradient(135deg, ${tokens.gradients.hero.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`,
    '--gradient-primary': `linear-gradient(135deg, ${tokens.gradients.primary.replace('from-', '').replace('to-', ', ')})`,
    '--gradient-secondary': `linear-gradient(135deg, ${tokens.gradients.secondary.replace('from-', '').replace('to-', ', ')})`,
    
    // Typography variables
    '--font-size-title-mobile': tokens.typography.title.mobile,
    '--font-size-title-desktop': tokens.typography.title.desktop,
    '--font-size-subtitle-mobile': tokens.typography.subtitle.mobile,
    '--font-size-subtitle-desktop': tokens.typography.subtitle.desktop,
    '--font-size-body-mobile': tokens.typography.body.mobile,
    '--font-size-body-desktop': tokens.typography.body.desktop,
    
    // Animation variables
    '--animation-hover': tokens.animations.hover,
    '--animation-button': tokens.animations.button,
    '--animation-card': tokens.animations.card,
  };
};

// Apply CSS variables to the document root
export const applyThemeVariables = (variables: Record<string, string>) => {
  const root = document.documentElement;
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

// Generate theme-aware Tailwind classes
export const generateThemeClasses = (tokens: DesignTokens) => {
  return {
    // Primary color classes
    primaryBg: `bg-[${tokens.colors.primary}]`,
    primaryText: `text-[${tokens.colors.primary}]`,
    primaryBorder: `border-[${tokens.colors.primary}]`,
    
    // Secondary color classes
    secondaryBg: `bg-[${tokens.colors.secondary}]`,
    secondaryText: `text-[${tokens.colors.secondary}]`,
    secondaryBorder: `border-[${tokens.colors.secondary}]`,
    
    // Accent color classes
    accentBg: `bg-[${tokens.colors.accent}]`,
    accentText: `text-[${tokens.colors.accent}]`,
    accentBorder: `border-[${tokens.colors.accent}]`,
    
    // Gradient classes
    heroGradient: `bg-gradient-to-br ${tokens.gradients.hero}`,
    primaryGradient: `bg-gradient-to-r ${tokens.gradients.primary}`,
    secondaryGradient: `bg-gradient-to-r ${tokens.gradients.secondary}`,
  };
};

// Create a complete theme object from theme config
export const createThemeFromConfig = (theme: ThemeConfig) => {
  const tokens = generateDesignTokens(theme);
  const cssVariables = generateCSSVariables(tokens);
  const themeClasses = generateThemeClasses(tokens);
  
  return {
    tokens,
    cssVariables,
    themeClasses,
    apply: () => applyThemeVariables(cssVariables)
  };
};

// Create a complete theme object from opportunity config
export const createThemeFromOpportunity = (opportunity: OpportunityWithTheme | null) => {
  if (!opportunity) {
    return createDefaultTheme();
  }

  const theme = opportunity.theme;
  
  const tokens = {
    colors: {
      primary: theme.branding?.primaryColor || 'blue-600',
      secondary: theme.branding?.secondaryColor || 'purple-600',
      accent: theme.branding?.accentColor || 'pink-600'
    },
    gradients: {
      hero: theme.branding?.gradients?.hero || 'from-blue-50 via-purple-50 to-pink-50',
      primary: theme.branding?.gradients?.primary || 'from-blue-600 to-purple-600',
      secondary: theme.branding?.gradients?.secondary || 'from-purple-600 to-pink-600',
      arrow: DEFAULT_DESIGN_TOKENS.gradients.arrow
    },
    spacing: DEFAULT_DESIGN_TOKENS.spacing,
    // Use the typography from DEFAULT_DESIGN_TOKENS instead of hardcoding
    typography: DEFAULT_DESIGN_TOKENS.typography,
    animations: DEFAULT_DESIGN_TOKENS.animations
  };

  const cssVariables = {
    '--color-primary': `var(--${tokens.colors.primary})`,
    '--color-secondary': `var(--${tokens.colors.secondary})`,
    '--color-accent': `var(--${tokens.colors.accent})`,
    '--gradient-hero': tokens.gradients.hero,
    '--gradient-primary': tokens.gradients.primary,
    '--gradient-secondary': tokens.gradients.secondary
  };

  const themeClasses = {
    primary: `text-${tokens.colors.primary}`,
    secondary: `text-${tokens.colors.secondary}`,
    accent: `text-${tokens.colors.accent}`,
    bgPrimary: `bg-${tokens.colors.primary}`,
    bgSecondary: `bg-${tokens.colors.secondary}`,
    bgAccent: `bg-${tokens.colors.accent}`,
    gradientHero: `bg-gradient-to-br ${tokens.gradients.hero}`,
    gradientPrimary: `bg-gradient-to-r ${tokens.gradients.primary}`,
    gradientSecondary: `bg-gradient-to-r ${tokens.gradients.secondary}`
  };

  const apply = () => {
    const root = document.documentElement;
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  return {
    tokens,
    cssVariables,
    themeClasses,
    apply
  };
};

// Helper function to extract color values from Tailwind classes
const extractColorFromTailwind = (tailwindClass: string): string => {
  // This is a simplified version - in a real app you'd want a more robust parser
  const colorMap: Record<string, string> = {
    'blue-600': '#2563eb',
    'purple-600': '#7c3aed',
    'pink-600': '#db2777',
    'green-600': '#059669',
    'red-600': '#dc2626',
    'yellow-600': '#d97706',
    'indigo-600': '#4f46e5',
    'teal-600': '#0d9488'
  };
  
  return colorMap[tailwindClass] || tailwindClass;
};

// Generate design tokens from theme configuration
export const generateDesignTokens = (theme: ThemeConfig): DesignTokens => {
  const { branding } = theme;
  
  return {
    colors: {
      primary: extractColorFromTailwind(branding.primaryColor),
      secondary: extractColorFromTailwind(branding.secondaryColor),
      accent: extractColorFromTailwind(branding.accentColor),
    },
    gradients: {
      hero: branding.gradients.hero,
      primary: branding.gradients.primary,
      secondary: branding.gradients.secondary,
      arrow: DEFAULT_DESIGN_TOKENS.gradients.arrow
    },
    spacing: DEFAULT_DESIGN_TOKENS.spacing,
    // Use the typography from DEFAULT_DESIGN_TOKENS instead of hardcoding
    typography: DEFAULT_DESIGN_TOKENS.typography,
    animations: DEFAULT_DESIGN_TOKENS.animations
  };
};

// Create a default theme object
export const createDefaultTheme = () => {
  const tokens = DEFAULT_DESIGN_TOKENS;
  const cssVariables = generateCSSVariables(tokens);
  const themeClasses = generateThemeClasses(tokens);
  
  return {
    tokens,
    cssVariables,
    themeClasses,
    apply: () => applyThemeVariables(cssVariables)
  };
};
