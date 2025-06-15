
import { supabase } from '@/integrations/supabase/client';

export interface CustomDomain {
  id: string;
  domain: string;
  target_type: 'profile' | 'opportunity';
  target_profile_id: string;
  target_opportunity_id?: string;
  is_verified: boolean;
  verification_token?: string;
  ssl_status: 'pending' | 'active' | 'failed';
  dns_configured: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export class CustomDomainsService {
  static async fetchUserDomains(): Promise<CustomDomain[]> {
    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching custom domains:', error);
      throw error;
    }

    return (data || []).map(domain => ({
      ...domain,
      target_type: domain.target_type as 'profile' | 'opportunity'
    }));
  }

  static async createDomain(domainData: Partial<CustomDomain>): Promise<CustomDomain> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('custom_domains')
      .insert([{
        domain: domainData.domain!,
        target_type: domainData.target_type!,
        target_profile_id: domainData.target_profile_id!,
        target_opportunity_id: domainData.target_opportunity_id,
        user_id: user.id,
        verification_token: this.generateVerificationToken()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating custom domain:', error);
      throw error;
    }

    return {
      ...data,
      target_type: data.target_type as 'profile' | 'opportunity'
    };
  }

  static async updateDomain(id: string, updates: Partial<CustomDomain>): Promise<CustomDomain> {
    const { data, error } = await supabase
      .from('custom_domains')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating custom domain:', error);
      throw error;
    }

    return {
      ...data,
      target_type: data.target_type as 'profile' | 'opportunity'
    };
  }

  static async deleteDomain(id: string): Promise<void> {
    const { error } = await supabase
      .from('custom_domains')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting custom domain:', error);
      throw error;
    }
  }

  static async resolveDomain(domain: string) {
    const { data, error } = await supabase
      .rpc('resolve_custom_domain', { domain_param: domain });

    if (error) {
      console.error('Error resolving custom domain:', error);
      return null;
    }

    return data?.[0] || null;
  }

  private static generateVerificationToken(): string {
    return `lgw-verify-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }
}
