
import React from "react";
import { Badge } from "@/components/ui/badge";

interface SkillBadgeProps {
  skill: string;
  index: number;
}

export const SkillBadge = React.memo(({ skill, index }: SkillBadgeProps) => {
  return (
    <Badge 
      className={`
        bg-gradient-to-r from-blue-100 to-purple-100 
        text-blue-700 border border-blue-200/50 
        hover:from-blue-200 hover:to-purple-200 
        transition-all duration-300 hover:scale-105 hover:rotate-2
        text-xs md:text-base 
        px-2 py-1 md:px-4 md:py-3
        h-8 md:h-auto
        flex items-center justify-center
        leading-tight
      `}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <span className="truncate text-center w-full">{skill}</span>
    </Badge>
  );
});

SkillBadge.displayName = "SkillBadge";
