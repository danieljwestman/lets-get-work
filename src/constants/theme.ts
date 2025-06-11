
// Re-export from the new unified design system for backward compatibility
export { DESIGN_SYSTEM as THEME } from '@/constants/designSystem';

// Maintain existing interface for backward compatibility
export const THEME_COMPAT = {
  colors: {
    primary: {
      blue: "blue-600",
      purple: "purple-600",
      pink: "pink-600"
    },
    background: {
      light: "blue-50",
      medium: "purple-50",
      dark: "pink-50"
    },
    text: {
      primary: "gray-800",
      secondary: "gray-600",
      muted: "gray-500"
    }
  },
  borderRadius: {
    button: "rounded-full",
    card: "rounded-xl",
    badge: "rounded-xl"
  },
  shadows: {
    card: "shadow-lg hover:shadow-xl",
    button: "shadow-lg hover:shadow-xl"
  }
} as const;
