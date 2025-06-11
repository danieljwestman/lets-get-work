
import { useTheme } from './useTheme';

export const useDesignTokens = () => {
  const { tokens } = useTheme();
  return tokens;
};
