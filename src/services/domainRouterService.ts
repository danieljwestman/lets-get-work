
import { supabase } from '@/integrations/supabase/client';

export interface DomainInfo {
  type: 'main' | 'subdomain' | 'custom';
  domain: string;
  profileId?: string;
  opportunityId?: string;
  isMainDomain: boolean;
  customDomainData?: {
    target_type: 'profile' | 'opportunity';
    target_profile_id: string;
    target_opportunity_id?: string;
  };
}

export class DomainRouterService {
  private static MAIN_DOMAIN = 'letsget.work';
  private static SUBDOMAIN_PATTERN = /^([a-z0-9_-]+)\.letsget\.work$/i;

  static async detectDomainType(hostname: string): Promise<DomainInfo> {
    console.log('🔧 DOMAIN ROUTER: Detecting domain type for:', hostname);

    // Development/preview environments - treat as main domain
    if (hostname.includes('localhost') || 
        hostname.includes('127.0.0.1') || 
        hostname.includes('.lovable.app') ||
        hostname.includes('lovableproject.com') ||
        hostname.includes('preview--')) {
      console.log('🔧 DOMAIN ROUTER: Development/preview environment detected as main domain');
      return {
        type: 'main',
        domain: hostname,
        isMainDomain: true
      };
    }

    // Check if it's the main domain
    if (hostname === this.MAIN_DOMAIN || hostname === `www.${this.MAIN_DOMAIN}`) {
      console.log('🔧 DOMAIN ROUTER: Main domain detected');
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
      console.log('🔧 DOMAIN ROUTER: Subdomain detected with profile ID:', profileId);
      return {
        type: 'subdomain',
        domain: hostname,
        profileId,
        isMainDomain: false
      };
    }

    // Check if it's a custom domain by querying the database
    try {
      console.log('🔧 DOMAIN ROUTER: Checking custom domain:', hostname);
      const { data, error } = await supabase.rpc('resolve_custom_domain', {
        domain_param: hostname
      });

      console.log('🔧 DOMAIN ROUTER: Custom domain query result:', { data, error, hostname });

      if (error) {
        console.error('🔧 DOMAIN ROUTER: Error resolving custom domain:', error);
      } else if (data && data.length > 0) {
        const customDomainData = data[0];
        console.log('🔧 DOMAIN ROUTER: Custom domain resolved:', customDomainData);
        
        // For custom domains, we need to resolve the actual profile_id string from the user_id
        let resolvedProfileId = customDomainData.target_profile_id;
        
        if (!resolvedProfileId && customDomainData.user_id) {
          console.log('🔧 DOMAIN ROUTER: Resolving profile_id for user_id:', customDomainData.user_id);
          
          // Fetch the actual profile_id string from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('profile_id')
            .eq('id', customDomainData.user_id)
            .single();
          
          if (profileError) {
            console.error('🔧 DOMAIN ROUTER: Error fetching profile_id:', profileError);
          } else if (profileData?.profile_id) {
            resolvedProfileId = profileData.profile_id;
            console.log('🔧 DOMAIN ROUTER: Resolved profile_id:', resolvedProfileId);
          } else {
            console.warn('🔧 DOMAIN ROUTER: No profile_id found for user_id:', customDomainData.user_id);
          }
        }
        
        // For custom opportunity domains, use the target_opportunity_id directly
        // For custom profile domains, let the path-based routing handle the opportunity ID
        const opportunityId = customDomainData.target_type === 'opportunity' 
          ? customDomainData.target_opportunity_id || 'default'
          : undefined; // Will be set by path-based routing
        
        console.log('🔧 DOMAIN ROUTER: Final custom domain info:', {
          type: customDomainData.target_type,
          profileId: resolvedProfileId,
          opportunityId,
          targetOpportunityId: customDomainData.target_opportunity_id
        });
        
        return {
          type: 'custom',
          domain: hostname,
          profileId: resolvedProfileId,
          opportunityId,
          isMainDomain: false,
          customDomainData: {
            target_type: customDomainData.target_type as 'profile' | 'opportunity',
            target_profile_id: customDomainData.target_profile_id,
            target_opportunity_id: customDomainData.target_opportunity_id
          }
        };
      } else {
        console.log('🔧 DOMAIN ROUTER: No custom domain data found for:', hostname);
      }
    } catch (error) {
      console.error('🔧 DOMAIN ROUTER: Exception resolving custom domain:', error);
    }

    // If we can't resolve it as a custom domain, treat it as unknown custom domain
    console.log('🔧 DOMAIN ROUTER: Unresolved custom domain detected');
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
  
  static getOpportunityUrl(profileId: string, opportunityId: string): string {
    if (opportunityId === 'default') {
      return `https://${profileId}.${this.MAIN_DOMAIN}`;
    }
    return `https://${profileId}.${this.MAIN_DOMAIN}/${opportunityId}`;
  }
}
