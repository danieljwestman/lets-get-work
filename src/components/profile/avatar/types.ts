
export interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

export const AVATAR_SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-20 w-20'
} as const;
