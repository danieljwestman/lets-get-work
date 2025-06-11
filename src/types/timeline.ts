
export interface TimelineExperience {
  title: string;
  company: string;
  period: string;
  description: string;
  emoji?: string;
}

export interface TimelinePosition {
  mobile: string;
  desktop: string;
}

export interface TimelineSpacing {
  items: string;
  circles: TimelinePosition;
}

export interface TimelineConfig {
  spacing: TimelineSpacing;
  animations: {
    duration: {
      dots: string;
      glow: string;
    };
  };
}
