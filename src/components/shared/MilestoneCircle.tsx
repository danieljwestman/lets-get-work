
import React from "react";
import { TIMELINE_STYLES } from "@/constants/timeline";

interface MilestoneCircleProps {
  emoji: string;
  isMobile?: boolean;
  position: string;
  animationDelay?: number;
}

export const MilestoneCircle = React.memo(({ 
  emoji, 
  isMobile = false, 
  position,
  animationDelay = 0 
}: MilestoneCircleProps) => {
  const styles = isMobile ? TIMELINE_STYLES.circle.mobile : TIMELINE_STYLES.circle.desktop;
  const positionStyle = isMobile && position !== "0" ? { top: position } : 
                       !isMobile ? { marginTop: position } : {};
  
  return (
    <div 
      className={`relative z-10 ${isMobile && position !== "0" ? 'absolute left-1/2 transform -translate-x-1/2' : 'flex-shrink-0'}`}
      style={positionStyle}
    >
      <div className="relative">
        {/* Main circle only */}
        <div className={`${styles.container} bg-white rounded-full border-2 border-purple-200 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 group z-20 relative`}>
          <span className={`${styles.emoji} group-hover:scale-110 transition-transform duration-300`}>
            {emoji}
          </span>
        </div>
      </div>
    </div>
  );
});

MilestoneCircle.displayName = "MilestoneCircle";
