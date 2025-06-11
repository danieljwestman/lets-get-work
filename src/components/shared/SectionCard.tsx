
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export const SectionCard = React.memo(({ children, className = "", gradient }: SectionCardProps) => {
  const cardClasses = gradient 
    ? `bg-gradient-to-r ${gradient} border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] hover:rotate-1 ${className}`
    : `bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${className}`;

  return (
    <Card className={cardClasses}>
      <CardContent className="p-6 md:p-12">
        {children}
      </CardContent>
    </Card>
  );
});

SectionCard.displayName = "SectionCard";
