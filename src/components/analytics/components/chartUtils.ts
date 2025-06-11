
export const getTickInterval = (dataLength: number): number => {
  if (dataLength <= 7) return 0; // Show all ticks
  if (dataLength <= 14) return 1; // Show every other tick
  if (dataLength <= 30) return Math.floor(dataLength / 8); // Show ~8 ticks
  return Math.floor(dataLength / 10); // Show ~10 ticks for longer periods
};

export const getChartMargins = () => ({
  top: 20,
  right: 30,
  left: 20,
  bottom: 60
});

export const getLineConfig = () => ({
  strokeWidth: 3,
  dot: { r: 4, strokeWidth: 2, stroke: "#ffffff" },
  activeDot: { r: 6, strokeWidth: 2, stroke: "#ffffff" },
  connectNulls: false
});

export const getLineColors = () => ({
  totalViews: "#3b82f6",      // Blue
  uniqueSessions: "#10b981",   // Green
  chatInteractions: "#8b5cf6", // Purple
  buttonClicks: "#f97316"      // Orange
});
