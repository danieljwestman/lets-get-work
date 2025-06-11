
// Re-export from the new unified design system
export { DESIGN_SYSTEM as GRADIENTS } from '@/constants/designSystem';
export { DESIGN_SYSTEM as ANIMATIONS } from '@/constants/designSystem';
export { DESIGN_SYSTEM as SPACING } from '@/constants/designSystem';
export { DESIGN_SYSTEM as BREAKPOINTS } from '@/constants/designSystem';
export { DESIGN_SYSTEM as TYPOGRAPHY } from '@/constants/designSystem';

// Maintain backward compatibility with existing exports
export const GRADIENTS_COMPAT = {
  primary: "from-blue-600 to-purple-600",
  secondary: "from-purple-600 to-pink-600",
  hero: "from-blue-50 via-purple-50 to-pink-50",
  skill: "from-blue-100 to-purple-100",
  skillHover: "from-blue-200 to-purple-200",
  arrow: {
    purple: "from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200",
    blue: "from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200",
    pink: "from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200",
    green: "from-green-100 to-teal-100 group-hover:from-green-200 group-hover:to-teal-200"
  }
} as const;
