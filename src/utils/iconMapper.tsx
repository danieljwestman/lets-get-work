
import { Target, Brain, MessageCircle, Palette, LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  "target": Target,
  "brain": Brain,
  "message-circle": MessageCircle,
  "palette": Palette,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Target;
};
