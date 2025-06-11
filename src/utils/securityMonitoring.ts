// Security monitoring and logging utilities
export interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'validation_error' | 'suspicious_activity';
  details: Record<string, any>;
  timestamp: number;
  userAgent?: string;
  url?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 100;

  logEvent(type: SecurityEvent['type'], details: Record<string, any>): void {
    const event: SecurityEvent = {
      type,
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent.substring(0, 100),
      url: window.location.href
    };

    this.events.push(event);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console for development
    console.warn('Security Event:', event);

    // In production, you might want to send this to your monitoring service
    this.reportToMonitoring(event);
  }

  private reportToMonitoring(event: SecurityEvent): void {
    // This could send to external monitoring services
    // For now, we'll just store locally
    try {
      const stored = localStorage.getItem('security_events') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 50 events in localStorage
      const recentEvents = events.slice(-50);
      localStorage.setItem('security_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Failed to store security event:', error);
    }
  }

  getRecentEvents(type?: SecurityEvent['type']): SecurityEvent[] {
    if (type) {
      return this.events.filter(event => event.type === type);
    }
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
    localStorage.removeItem('security_events');
  }
}

export const securityMonitor = new SecurityMonitor();

// Helper functions for common security events
export const logAuthFailure = (details: Record<string, any>) => {
  securityMonitor.logEvent('auth_failure', details);
};

export const logRateLimit = (details: Record<string, any>) => {
  securityMonitor.logEvent('rate_limit', details);
};

export const logValidationError = (details: Record<string, any>) => {
  securityMonitor.logEvent('validation_error', details);
};

export const logSuspiciousActivity = (details: Record<string, any>) => {
  securityMonitor.logEvent('suspicious_activity', details);
};
