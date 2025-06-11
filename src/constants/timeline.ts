
import { TimelineConfig } from "@/types/timeline";

export const TIMELINE_CONFIG: TimelineConfig = {
  spacing: {
    items: "space-y-12 sm:space-y-16 md:space-y-20",
    circles: {
      mobile: "-35px",
      desktop: "-35px"
    }
  },
  animations: {
    duration: {
      dots: "3s",
      glow: "2.5s"
    }
  }
};

export const TIMELINE_STYLES = {
  line: {
    mobile: "sm:hidden absolute left-1/2 transform -translate-x-1/2 top-16 bottom-8 w-1",
    desktop: "hidden sm:block absolute left-8 top-16 bottom-8 w-1"
  },
  circle: {
    mobile: {
      container: "w-12 h-12",
      glow: "w-14 h-14",
      emoji: "text-lg"
    },
    desktop: {
      container: "w-16 h-16",
      glow: "w-20 h-20",
      emoji: "text-2xl"
    }
  }
} as const;
