
import { useState, useEffect } from 'react';
import { CustomDomainsService, type CustomDomain } from '@/services/customDomainsService';

export const useCustomDomains = () => {
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CustomDomainsService.fetchUserDomains();
      setDomains(data);
    } catch (err) {
      console.error('Error fetching domains:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch domains');
    } finally {
      setLoading(false);
    }
  };

  const deleteDomain = async (id: string) => {
    await CustomDomainsService.deleteDomain(id);
    setDomains(domains.filter(d => d.id !== id));
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return {
    domains,
    loading,
    error,
    refetch: fetchDomains,
    deleteDomain
  };
};
