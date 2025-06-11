
export interface ActivityTrendsData {
  date: string;
  totalViews: number;
  uniqueSessions: number;
  chatInteractions: number;
  buttonClicks: number;
}

export interface DailyActivityData {
  views: number;
  sessions: Set<string>;
  chatStarts: number;
  chatPrompts: number;
  buttonClicks: number;
}
