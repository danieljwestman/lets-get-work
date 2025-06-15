
export interface DomainInfo {
  type: 'main' | 'subdomain' | 'custom';
  domain: string;
  profileId?: string;
  opportunityId?: string;
  isMainDomain: boolean;
}

export class DomainRouterService {
  private static MAIN_DOMAIN = 'letsget.work';
  private static SUBDOMAIN_PATTERN = /^([a-z0-9_-]+)\.letsget\.work$/i;

  static detectDomainType(hostname: string): DomainInfo {
    console.log('🔧 DOMAIN ROUTER: Detecting domain type for:', hostname);

    // Development/preview environments
    if (hostname.includes('localhost') || 
        hostname.includes('127.0.0.1') || 
        hostname.includes('.lovable.app') ||
        hostname.includes('lovableproject.com') ||
        hostname.includes('preview--')) {
      return {
        type: 'main',
        domain: hostname,
        isMainDomain: true
      };
    }

    // Check if it's the main domain
    if (hostname === this.MAIN_DOMAIN || hostname === `www.${this.MAIN_DOMAIN}`) {
      return {
        type: 'main',
        domain: hostname,
        isMainDomain: true
      };
    }

    // Check if it's a subdomain
    const subdomainMatch = hostname.match(this.SUBDOMAIN_PATTERN);
    if (subdomainMatch) {
      const profileId = subdomainMatch[1];
      return {
        type: 'subdomain',
        domain: hostname,
        profileId,
        isMainDomain: false
      };
    }

    // Everything else is treated as a custom domain
    return {
      type: 'custom',
      domain: hostname,
      isMainDomain: false
    };
  }

  static shouldRedirectToDashboard(domainInfo: DomainInfo, pathname: string): boolean {
    // Redirect subdomain users trying to access dashboard to main domain
    return domainInfo.type === 'subdomain' && pathname.startsWith('/dashboard');
  }

  static getDashboardUrl(): string {
    // Always redirect to main domain for dashboard
    return `https://${this.MAIN_DOMAIN}/dashboard`;
  }

  static getProfileUrl(profileId: string): string {
    return `https://${profileId}.${this.MAIN_DOMAIN}`;
  }
}
