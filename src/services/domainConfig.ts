
interface DomainConfig {
  mainDomain: string;
  contactEmail: string;
  companyWebsite: string;
  defaultSenderName: string;
  environment: string;
}

class DomainConfigService {
  private config: DomainConfig | null = null;
  private configPromise: Promise<DomainConfig> | null = null;

  async getConfig(): Promise<DomainConfig> {
    if (this.config) {
      console.log('🔧 DomainConfig: Returning cached config:', this.config);
      return this.config;
    }

    // Prevent multiple simultaneous requests
    if (this.configPromise) {
      console.log('🔧 DomainConfig: Waiting for existing promise...');
      return this.configPromise;
    }

    console.log('🔧 DomainConfig: Starting new config fetch...');
    this.configPromise = this.fetchConfigFromEdgeFunction();
    
    try {
      this.config = await this.configPromise;
      console.log('🔧 DomainConfig: Successfully cached config:', this.config);
      return this.config;
    } catch (error) {
      console.error('🔧 DomainConfig: Failed to fetch config, resetting promise:', error);
      this.configPromise = null; // Reset promise on error to allow retry
      throw error;
    }
  }

  private async fetchConfigFromEdgeFunction(): Promise<DomainConfig> {
    console.log('🔧 DomainConfig: Fetching configuration from edge function...');
    
    try {
      // Import supabase client dynamically to avoid circular dependencies
      const { supabase } = await import('@/integrations/supabase/client');
      
      console.log('🔧 DomainConfig: Calling edge function...');
      const { data, error } = await supabase.functions.invoke('get-domain-config');

      if (error) {
        console.error('🔧 DomainConfig: Edge function error:', error);
        throw new Error(`Failed to load domain configuration: ${error.message}`);
      }

      if (!data?.data) {
        console.error('🔧 DomainConfig: No data received from edge function:', data);
        throw new Error('Domain configuration not available');
      }

      const config = data.data;
      console.log('🔧 DomainConfig: Raw config from edge function:', config);
      
      // Validate that all required fields are present
      if (!config.mainDomain || !config.contactEmail || !config.companyWebsite || !config.defaultSenderName) {
        console.error('🔧 DomainConfig: Incomplete configuration received:', config);
        throw new Error('Incomplete domain configuration - missing required fields');
      }

      const finalConfig = {
        ...config,
        environment: config.environment || 'dev'
      };

      console.log('🔧 DomainConfig: Configuration loaded successfully:', finalConfig);
      return finalConfig;
    } catch (error: any) {
      console.error('🔧 DomainConfig: Failed to fetch configuration:', error);
      throw new Error(`Domain configuration error: ${error.message}`);
    }
  }

  getRootDomain(): string {
    // Extract root domain for cookie settings
    const hostname = window.location.hostname;
    
    // For localhost and IP addresses, don't set domain
    if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return '';
    }
    
    // For preview domains and development environments
    if (hostname.includes('.lovable.app') || hostname.includes('lovableproject.com') || hostname.includes('lovable.dev')) {
      return '';
    }
    
    // For main domain, extract the root - this will be determined by MAIN_DOMAIN env var
    // For now, use a simple extraction based on the current hostname
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return `.${parts.slice(-2).join('.')}`;
    }
    
    return '';
  }

  async getMainDomain(): Promise<string> {
    const config = await this.getConfig();
    return config.mainDomain;
  }

  async getContactEmail(): Promise<string> {
    const config = await this.getConfig();
    return config.contactEmail;
  }

  async getCompanyWebsite(): Promise<string> {
    const config = await this.getConfig();
    return config.companyWebsite;
  }

  async getDefaultSenderName(): Promise<string> {
    const config = await this.getConfig();
    return config.defaultSenderName;
  }

  async getEnvironment(): Promise<string> {
    const config = await this.getConfig();
    return config.environment;
  }

  async isDev(): Promise<boolean> {
    const env = await this.getEnvironment();
    return env === 'dev';
  }

  async isProd(): Promise<boolean> {
    const env = await this.getEnvironment();
    return env === 'prod';
  }

  // Method to clear cache and force reload of configuration
  clearCache(): void {
    this.config = null;
    this.configPromise = null;
    console.log('DomainConfig: Cache cleared');
  }
}

export const domainConfig = new DomainConfigService();
