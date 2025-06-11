
// Central configuration for debug panel
export const DEBUG_CONFIG = {
  // Rate limiting settings
  RATE_LIMIT: {
    MAX_ACCESS_ATTEMPTS: 5,
    WINDOW_MS: 30000, // 30 seconds
    BLOCK_DURATION_MS: 60000, // 1 minute
  },
  
  // Security settings
  SECURITY: {
    MAX_VIOLATIONS: 5,
    VIOLATION_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    ENABLE_SECURITY_CHECKS: true,
    LOG_SUSPICIOUS_ACTIVITY: true,
  },
  
  // Performance settings
  PERFORMANCE: {
    VIEWPORT_RESIZE_THROTTLE_MS: 100,
    MAX_SECURITY_EVENTS: 50,
    CLEANUP_INTERVAL_MS: 60000, // 1 minute
  },
  
  // UI settings
  UI: {
    TRUNCATE_LENGTH: 12,
    ANIMATION_DURATION: 300,
    MIN_MOBILE_WIDTH: 640,
  },
  
  // Keyboard shortcuts
  SHORTCUTS: {
    TOGGLE_DEBUG: 'ctrl+shift+d',
    COPY_INFO: 'ctrl+shift+c',
  },
};

// Environment-specific overrides
export const getDebugConfig = () => {
  const config = JSON.parse(JSON.stringify(DEBUG_CONFIG));
  
  if (process.env.NODE_ENV === 'production') {
    config.SECURITY.ENABLE_SECURITY_CHECKS = true;
    config.SECURITY.LOG_SUSPICIOUS_ACTIVITY = true;
  }
  
  return config;
};
