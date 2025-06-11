import { DesignTokens } from '@/types/design';

// Unified design system constants
export const DESIGN_SYSTEM = {
  // Base color palette that can be customized per company
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      900: '#4c1d95'
    },
    accent: {
      50: '#fdf2f8',
      100: '#fce7f3',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      900: '#831843'
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },

  // Typography scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Monaco', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    }
  },

  // Spacing scale - including layout spacing needed by components
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    // Layout spacing classes used by components
    section: 'px-4 sm:px-6 py-12 sm:py-16',
    sectionSmall: 'px-4 sm:px-6 py-8 sm:py-12',
    container: 'mx-auto max-w-4xl px-4 sm:px-0'
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },

  // Animations - including animation classes used by components
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    timing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    },
    // Animation classes used by components
    hover: 'transition-all duration-300 hover:scale-105',
    hoverRotate: 'transition-all duration-300 hover:scale-105 hover:rotate-2',
    hoverRotateNeg: 'transition-all duration-300 hover:scale-105 hover:-rotate-2',
    button: 'transition-all duration-300 hover:scale-105',
    card: 'transition-all duration-300 hover:scale-[1.02] hover:-rotate-1'
  }
} as const;

// Default design tokens that can be overridden by company configurations
export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colors: {
    primary: DESIGN_SYSTEM.colors.primary[600],
    secondary: DESIGN_SYSTEM.colors.secondary[600],
    accent: DESIGN_SYSTEM.colors.accent[600],
  },
  gradients: {
    hero: 'from-blue-50 via-purple-50 to-pink-50',
    primary: 'from-blue-600 to-purple-600',
    secondary: 'from-purple-600 to-pink-600',
    arrow: {
      purple: 'from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200',
      blue: 'from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200',
      pink: 'from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200',
      green: 'from-green-100 to-teal-100 group-hover:from-green-200 group-hover:to-teal-200'
    }
  },
  spacing: {
    section: 'px-4 sm:px-6 py-12 sm:py-16',
    sectionSmall: 'px-4 sm:px-6 py-8 sm:py-12',
    container: 'mx-auto max-w-4xl px-4 sm:px-0'
  },
  typography: {
    title: {
      mobile: 'text-5xl',
      desktop: 'text-6xl'
    },
    subtitle: {
      mobile: 'text-base sm:text-lg',
      desktop: 'text-lg md:text-xl'
    },
    body: {
      mobile: 'text-sm sm:text-base',
      desktop: 'text-base md:text-lg'
    }
  },
  animations: {
    hover: 'transition-all duration-300 hover:scale-105',
    hoverRotate: 'transition-all duration-300 hover:scale-105 hover:rotate-2',
    hoverRotateNeg: 'transition-all duration-300 hover:scale-105 hover:-rotate-2',
    button: 'transition-all duration-300 hover:scale-105',
    card: 'transition-all duration-300 hover:scale-[1.02] hover:-rotate-1'
  }
};
