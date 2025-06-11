
import React from "react";
import { ExperienceCard } from "./ExperienceCard";
import { MilestoneCircle } from "./MilestoneCircle";
import { TIMELINE_CONFIG, TIMELINE_STYLES } from "@/constants/timeline";
import { TimelineExperience } from "@/types/timeline";

interface JourneyTimelineProps {
  experiences: TimelineExperience[];
}

export const JourneyTimeline = React.memo(({ experiences }: JourneyTimelineProps) => {
  // Validate experiences prop
  const validExperiences = React.useMemo(() => {
    if (!Array.isArray(experiences)) {
      console.warn('JourneyTimeline: experiences prop must be an array');
      return [];
    }
    return experiences.filter(exp => exp && typeof exp === 'object' && exp.title && exp.company);
  }, [experiences]);

  if (validExperiences.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-500">No experiences to display</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Timeline Container */}
      <div className="relative pt-4">
        {/* Mobile Timeline Line - starts from first circle */}
        <div className={`sm:hidden absolute left-1/2 transform -translate-x-1/2 top-10 bottom-8 w-1 z-0`}>
          <div className="h-full bg-gradient-to-b from-purple-200 via-purple-300 to-purple-200 relative overflow-hidden rounded-full">
            <div 
              className="absolute inset-0 bg-gradient-to-b from-purple-300 to-purple-400 opacity-70 animate-timeline-dots-mobile"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(147, 51, 234, 0.9) 1px, transparent 1px)`,
                backgroundSize: '4px 12px'
              }}
            />
          </div>
        </div>
        
        {/* Desktop Timeline Line - starts closer to first card */}
        <div className={`hidden sm:block absolute left-8 w-1 z-0`} style={{ top: '40px', bottom: '60px' }}>
          <div className="h-full bg-gradient-to-b from-purple-200 via-purple-300 to-transparent relative overflow-hidden rounded-full">
            <div 
              className="absolute inset-0 bg-gradient-to-b from-purple-300 via-purple-400 to-transparent opacity-70 animate-timeline-dots-desktop"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(147, 51, 234, 0.9) 1.5px, transparent 1.5px)`,
                backgroundSize: '4px 15px'
              }}
            />
          </div>
        </div>
        
        {/* Timeline Items */}
        <div className={TIMELINE_CONFIG.spacing.items}>
          {validExperiences.map((experience, index) => (
            <div key={`${experience.title}-${index}`} className="relative">
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="relative">
                  {/* Center icon above the card */}
                  <div className="flex justify-center mb-5 relative z-10">
                    <MilestoneCircle
                      emoji={experience.emoji || "🚀"}
                      isMobile={true}
                      position="0"
                      animationDelay={index * 200}
                    />
                  </div>
                  
                  <div className="px-0 relative z-10">
                    <ExperienceCard experience={experience} />
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-start gap-6">
                <MilestoneCircle
                  emoji={experience.emoji || "🚀"}
                  isMobile={false}
                  position={TIMELINE_CONFIG.spacing.circles.desktop}
                  animationDelay={index * 300}
                />

                <div className="flex-1 max-w-2xl">
                  <ExperienceCard experience={experience} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

JourneyTimeline.displayName = "JourneyTimeline";
