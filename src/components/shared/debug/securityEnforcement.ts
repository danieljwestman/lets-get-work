import { logSuspiciousActivity, logValidationError } from '@/utils/securityMonitoring';

// Enhanced security enforcement utilities
export interface SecurityContext {
  isProduction: boolean;
  isAuthenticated: boolean;
  userRole?: string;
  requestOrigin: string;
}

class SecurityEnforcer {
  private static instance: SecurityEnforcer;
  private securityViolations = new Map<string, number>();
  private maxViolations = 5;
  private violationWindow = 15 * 60 * 1000; // 15 minutes

  static getInstance(): SecurityEnforcer {
    if (!SecurityEnforcer.instance) {
      SecurityEnforcer.instance = new SecurityEnforcer();
    }
    return SecurityEnforcer.instance;
  }

  // Simplified debug access validation - main environment check is handled by useDebugData
  validateDebugAccess(context: SecurityContext): boolean {
    const clientId = this.getClientIdentifier();
    
    // Only block if we're absolutely certain we're in production AND not localhost
    if (context.isProduction && window.location.hostname !== 'localhost' && !window.location.hostname.includes('lovable')) {
      this.recordViolation(clientId, 'production_debug_access');
      return false;
    }

    // Check for repeated violations
    const violations = this.securityViolations.get(clientId) || 0;
    if (violations >= this.maxViolations) {
      logSuspiciousActivity({
        event: 'debug_access_blocked',
        client_id: clientId,
        violations
      });
      return false;
    }

    return true;
  }

  // Enhanced sensitive data detection
  containsSensitiveData(data: any): boolean {
    const sensitivePatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i, // UUID
      /\b(?:sk|pk)_[a-zA-Z0-9]+/, // API keys
      /\b(?:password|token|secret|key|auth)\b/i, // Sensitive keywords
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/ // SSN
    ];

    const dataString = JSON.stringify(data).toLowerCase();
    return sensitivePatterns.some(pattern => pattern.test(dataString));
  }

  // Sanitize data for logging/display
  sanitizeForDisplay(data: any): any {
    if (typeof data === 'string') {
      return this.obfuscateString(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeForDisplay(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitiveField(key)) {
          sanitized[key] = this.obfuscateString(String(value));
        } else {
          sanitized[key] = this.sanitizeForDisplay(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  private isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = [
      'id', 'user_id', 'email', 'password', 'token', 'secret', 'key',
      'api_key', 'auth_token', 'session_id', 'uuid'
    ];
    return sensitiveFields.some(field => 
      fieldName.toLowerCase().includes(field)
    );
  }

  private obfuscateString(str: string): string {
    if (str.length <= 8) return '***';
    return `${str.substring(0, 4)}...${str.substring(str.length - 4)}`;
  }

  private recordViolation(clientId: string, type: string): void {
    const current = this.securityViolations.get(clientId) || 0;
    this.securityViolations.set(clientId, current + 1);
    
    logSuspiciousActivity({
      event: 'security_violation',
      type,
      client_id: clientId,
      total_violations: current + 1
    });

    // Clean up old violations
    setTimeout(() => {
      this.securityViolations.delete(clientId);
    }, this.violationWindow);
  }

  private getClientIdentifier(): string {
    // Enhanced client fingerprinting for security
    const factors = [
      navigator.userAgent.substring(0, 50),
      navigator.language,
      screen.width,
      screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      window.location.hostname
    ];
    
    const hash = factors.join('|').split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return `client_${Math.abs(hash)}`;
  }

  // Validate environment integrity
  validateEnvironment(): boolean {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isLocalhost = window.location.hostname === 'localhost';
    
    // Security check: ensure consistent environment indicators
    if (isProduction && isLocalhost) {
      logSuspiciousActivity({
        event: 'environment_mismatch',
        details: 'Production mode on localhost'
      });
      return false;
    }

    return true;
  }
}

export const securityEnforcer = SecurityEnforcer.getInstance();

// Enhanced security middleware for debug operations
export const withSecurityEnforcement = <T extends (...args: any[]) => any>(
  fn: T,
  requireAuth = false
): T => {
  return ((...args: any[]) => {
    const context: SecurityContext = {
      isProduction: process.env.NODE_ENV === 'production',
      isAuthenticated: false, // Would be populated from auth context
      requestOrigin: window.location.origin
    };

    // Validate environment
    if (!securityEnforcer.validateEnvironment()) {
      throw new Error('Security validation failed');
    }

    // Validate debug access
    if (!securityEnforcer.validateDebugAccess(context)) {
      throw new Error('Debug access denied');
    }

    // Execute original function with security monitoring
    try {
      return fn(...args);
    } catch (error) {
      logValidationError({
        function: fn.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        args: securityEnforcer.sanitizeForDisplay(args)
      });
      throw error;
    }
  }) as T;
};
