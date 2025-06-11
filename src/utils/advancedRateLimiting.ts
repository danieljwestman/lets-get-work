
import { logRateLimit, logSuspiciousActivity } from './securityMonitoring';

interface RateLimitConfig {
  requests: number;
  windowMs: number;
  blockDurationMs?: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (identifier: string) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
  attempts: number[];
}

class AdvancedRateLimit {
  private storage = new Map<string, RateLimitEntry>();
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      blockDurationMs: config.windowMs * 2,
      skipSuccessfulRequests: false,
      keyGenerator: (id: string) => id,
      ...config
    };

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  check(identifier: string): { allowed: boolean; resetTime: number; remaining: number } {
    const key = this.config.keyGenerator(identifier);
    const now = Date.now();
    
    let entry = this.storage.get(key);
    
    // Initialize or reset if window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
        attempts: []
      };
      this.storage.set(key, entry);
    }

    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      logRateLimit({
        identifier,
        action: 'blocked_request',
        remaining_block_time: entry.blockedUntil - now
      });
      
      return {
        allowed: false,
        resetTime: entry.blockedUntil,
        remaining: 0
      };
    }

    // Clean old attempts (for pattern analysis)
    entry.attempts = entry.attempts.filter(time => time > now - this.config.windowMs);
    
    // Check rate limit
    if (entry.count >= this.config.requests) {
      // Block user for extended period on repeated violations
      entry.blockedUntil = now + this.config.blockDurationMs;
      
      // Detect suspicious patterns
      if (entry.attempts.length > this.config.requests * 2) {
        logSuspiciousActivity({
          identifier,
          pattern: 'excessive_requests',
          attempts_in_window: entry.attempts.length,
          window_ms: this.config.windowMs
        });
      }

      logRateLimit({
        identifier,
        action: 'rate_limit_exceeded',
        requests: entry.count,
        window_ms: this.config.windowMs
      });

      return {
        allowed: false,
        resetTime: entry.resetTime,
        remaining: 0
      };
    }

    // Allow request
    entry.count++;
    entry.attempts.push(now);
    
    return {
      allowed: true,
      resetTime: entry.resetTime,
      remaining: this.config.requests - entry.count
    };
  }

  reset(identifier: string): void {
    const key = this.config.keyGenerator(identifier);
    this.storage.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now >= entry.resetTime && (!entry.blockedUntil || now >= entry.blockedUntil)) {
        this.storage.delete(key);
      }
    }
  }

  getStats(): { active_limits: number; blocked_users: number } {
    const now = Date.now();
    let blocked = 0;
    
    for (const entry of this.storage.values()) {
      if (entry.blockedUntil && now < entry.blockedUntil) {
        blocked++;
      }
    }
    
    return {
      active_limits: this.storage.size,
      blocked_users: blocked
    };
  }
}

// Predefined rate limiters for different actions
export const chatRateLimit = new AdvancedRateLimit({
  requests: 10,
  windowMs: 60000, // 1 minute
  blockDurationMs: 300000, // 5 minutes
});

export const emailRateLimit = new AdvancedRateLimit({
  requests: 3,
  windowMs: 300000, // 5 minutes
  blockDurationMs: 900000, // 15 minutes
});

export const authRateLimit = new AdvancedRateLimit({
  requests: 5,
  windowMs: 900000, // 15 minutes
  blockDurationMs: 3600000, // 1 hour
});

export const apiRateLimit = new AdvancedRateLimit({
  requests: 100,
  windowMs: 60000, // 1 minute
  blockDurationMs: 300000, // 5 minutes
});

// Helper function to get client identifier
export const getClientIdentifier = (): string => {
  // Combine multiple factors for better identification
  const factors = [
    navigator.userAgent.substring(0, 50),
    navigator.language,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ];
  
  // Simple hash function for anonymization
  const hash = factors.join('|').split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return `client_${Math.abs(hash)}`;
};
