
// Re-export timeline types for backward compatibility
export type { TimelineExperience as Experience } from './timeline';

export interface Tool {
  name: string;
  color: string;
}

export interface ToolCategory {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  tools: Tool[];
  highlight: string;
}

export interface HeroSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

export interface AnimatedArrowProps {
  targetSection: string;
  gradientColors: string;
  onClick: (sectionId: string) => void;
}

export interface SkillBadgeProps {
  skill: string;
  className?: string;
  index?: number;
}

export interface ToolCategoryProps {
  category: ToolCategory;
}

export interface SkillItem {
  text: string;
  emoji: string;
}
