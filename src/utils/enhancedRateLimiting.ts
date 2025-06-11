
import { getClientIdentifier } from './advancedRateLimiting';
import { logRateLimit, logSuspiciousActivity } from './securityMonitoring';

// Enhanced rate limiting with security-focused implementation
interface SecurityRateLimitConfig {
  requests: number;
  windowMs: number;
  blockDurationMs?: number;
  progressiveBlocking?: boolean;
  securityThreshold?: number;
}

class SecurityRateLimit {
  private storage = new Map<string, any>();
  private securityViolations = new Map<string, number>();
  private config: Required<SecurityRateLimitConfig>;

  constructor(config: SecurityRateLimitConfig) {
    this.config = {
      blockDurationMs: config.windowMs * 2,
      progressiveBlocking: true,
      securityThreshold: config.requests * 3,
      ...config
    };
  }

  check(identifier: string): { allowed: boolean; resetTime: number; remaining: number; isSecurityThreat: boolean } {
    const now = Date.now();
    let entry = this.storage.get(identifier);
    
    // Initialize or reset if window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
        attempts: [],
        violations: 0
      };
      this.storage.set(identifier, entry);
    }

    // Clean old attempts
    entry.attempts = entry.attempts.filter((time: number) => time > now - this.config.windowMs);
    
    // Check for security threats (excessive requests)
    const isSecurityThreat = entry.attempts.length > this.config.securityThreshold;
    if (isSecurityThreat) {
      logSuspiciousActivity({
        identifier,
        event: 'potential_security_threat',
        attempts_in_window: entry.attempts.length,
        threshold: this.config.securityThreshold
      });
    }

    // Progressive blocking for repeat offenders
    const violations = this.securityViolations.get(identifier) || 0;
    const blockMultiplier = this.config.progressiveBlocking ? Math.pow(2, violations) : 1;
    const effectiveBlockDuration = this.config.blockDurationMs * blockMultiplier;

    // Check if currently blocked
    if (entry.blockedUntil && now < entry.blockedUntil) {
      logRateLimit({
        identifier,
        action: 'blocked_request',
        remaining_block_time: entry.blockedUntil - now,
        violation_level: violations
      });
      
      return {
        allowed: false,
        resetTime: entry.blockedUntil,
        remaining: 0,
        isSecurityThreat
      };
    }

    // Check rate limit
    if (entry.count >= this.config.requests) {
      // Block user and record violation
      entry.blockedUntil = now + effectiveBlockDuration;
      entry.violations++;
      
      // Update violation count
      this.securityViolations.set(identifier, violations + 1);
      
      logRateLimit({
        identifier,
        action: 'rate_limit_exceeded',
        requests: entry.count,
        window_ms: this.config.windowMs,
        block_duration: effectiveBlockDuration,
        violation_level: violations + 1
      });

      return {
        allowed: false,
        resetTime: entry.resetTime,
        remaining: 0,
        isSecurityThreat
      };
    }

    // Allow request
    entry.count++;
    entry.attempts.push(now);
    
    return {
      allowed: true,
      resetTime: entry.resetTime,
      remaining: this.config.requests - entry.count,
      isSecurityThreat
    };
  }

  // Security-focused rate limiters
  static debugPanelRateLimit = new SecurityRateLimit({
    requests: 5,
    windowMs: 30000, // 30 seconds
    blockDurationMs: 60000, // 1 minute
    securityThreshold: 15
  });

  static authenticationRateLimit = new SecurityRateLimit({
    requests: 3,
    windowMs: 300000, // 5 minutes
    blockDurationMs: 900000, // 15 minutes
    securityThreshold: 10
  });

  static apiRateLimit = new SecurityRateLimit({
    requests: 50,
    windowMs: 60000, // 1 minute
    blockDurationMs: 300000, // 5 minutes
    securityThreshold: 150
  });
}

// Enhanced rate limiting middleware
export const withRateLimit = (rateLimit: SecurityRateLimit) => {
  return <T extends (...args: any[]) => any>(fn: T): T => {
    return ((...args: any[]) => {
      const clientId = getClientIdentifier();
      const result = rateLimit.check(clientId);
      
      if (!result.allowed) {
        const error = new Error(`Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`);
        (error as any).isRateLimit = true;
        (error as any).resetTime = result.resetTime;
        throw error;
      }

      if (result.isSecurityThreat) {
        console.warn('CRITICAL: Security threat detected - excessive requests');
      }
      
      return fn(...args);
    }) as T;
  };
};

export { SecurityRateLimit };
