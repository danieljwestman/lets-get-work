
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TimelineExperience } from "@/types/timeline";

interface ExperienceCardProps {
  experience: TimelineExperience;
}

export const ExperienceCard = React.memo(({ experience }: ExperienceCardProps) => {
  // Validate experience data
  if (!experience || typeof experience !== 'object') {
    console.warn('ExperienceCard: Invalid experience data');
    return null;
  }

  const { title, company, period, description } = experience;

  return (
    <Card className="bg-white/95 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-200 w-full">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 leading-tight">
              {title}
            </h3>
            <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:items-center sm:gap-2 text-purple-600 font-medium">
              <span className="text-sm sm:text-base font-semibold">{company}</span>
              <span className="hidden sm:inline text-purple-400" aria-hidden="true">•</span>
              <span className="text-xs sm:text-sm text-purple-500 font-medium">{period}</span>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

ExperienceCard.displayName = "ExperienceCard";
