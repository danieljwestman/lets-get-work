
import { domainConfig } from '@/services/domainConfig';

// Production safeguards and build-time security
export class ProductionSafeguards {
  private static isProduction: boolean | null = null;

  // Get production status from Supabase ENV
  private static async getIsProduction(): Promise<boolean> {
    if (this.isProduction !== null) {
      return this.isProduction;
    }
    
    try {
      const isProd = await domainConfig.isProd();
      this.isProduction = isProd;
      return isProd;
    } catch (error) {
      console.warn('Failed to get ENV from Supabase, defaulting to prod for safety:', error);
      this.isProduction = true; // Default to prod for safety
      return true;
    }
  }

  // Disable console logs in production
  static async setupConsoleProtection(): Promise<void> {
    const isProduction = await this.getIsProduction();
    
    if (isProduction) {
      // Override console methods in production
      const noop = () => {};
      console.log = noop;
      console.debug = noop;
      console.info = noop;
      console.warn = (message: any) => {
        // Only allow critical warnings
        if (typeof message === 'string' && message.includes('CRITICAL')) {
          // eslint-disable-next-line no-console
          console.error(message);
        }
      };
    }
  }

  // Disable debug tools in production
  static async disableDebugTools(): Promise<void> {
    const isProduction = await this.getIsProduction();
    
    if (isProduction) {
      // Disable React DevTools
      if (typeof window !== 'undefined') {
        (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
          isDisabled: true,
          supportsFiber: true,
          inject: () => {},
          onCommitFiberRoot: () => {},
          onCommitFiberUnmount: () => {}
        };
      }
    }
  }

  // Enhanced Content Security Policy
  static async getCSPDirectives(): Promise<Record<string, string>> {
    const isProduction = await this.getIsProduction();
    
    const baseDirectives = {
      'default-src': "'self'",
      'script-src': isProduction 
        ? "'self'" 
        : "'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
      'img-src': "'self' data: https: blob:",
      'font-src': "'self' https://fonts.gstatic.com",
      'connect-src': "'self' https://*.supabase.co",
      'frame-src': "'none'",
      'object-src': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'upgrade-insecure-requests': isProduction ? '' : undefined
    };

    // Remove undefined values
    return Object.fromEntries(
      Object.entries(baseDirectives).filter(([_, value]) => value !== undefined)
    );
  }

  // Security headers for production
  static async getSecurityHeaders(): Promise<Record<string, string>> {
    const isProduction = await this.getIsProduction();
    
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      ...(isProduction && {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      })
    };
  }

  // Initialize all production safeguards
  static async initialize(): Promise<void> {
    await this.setupConsoleProtection();
    await this.disableDebugTools();
    
    const isProduction = await this.getIsProduction();
    
    // Add security headers via meta tags (for client-side apps)
    if (typeof document !== 'undefined' && isProduction) {
      await this.addSecurityMetaTags();
    }
  }

  private static async addSecurityMetaTags(): Promise<void> {
    const headers = await this.getSecurityHeaders();
    const cspDirectives = await this.getCSPDirectives();
    
    // Add CSP meta tag
    const cspContent = Object.entries(cspDirectives)
      .map(([directive, value]) => `${directive} ${value}`)
      .join('; ');
    
    const cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', cspContent);
    document.head.appendChild(cspMeta);
    
    // Add other security headers as meta tags where applicable
    Object.entries(headers).forEach(([name, value]) => {
      if (['X-Content-Type-Options', 'X-Frame-Options'].includes(name)) {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', name);
        meta.setAttribute('content', value);
        document.head.appendChild(meta);
      }
    });
  }
}

// Auto-initialize safeguards
ProductionSafeguards.initialize();
