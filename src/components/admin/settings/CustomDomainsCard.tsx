
import React, { useState } from 'react';
import { Plus, ExternalLink, Copy, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCustomDomains } from '../hooks/useCustomDomains';
import { CustomDomainDialog } from './CustomDomainDialog';
import type { CustomDomain } from '@/services/customDomainsService';

export const CustomDomainsCard: React.FC = () => {
  const { toast } = useToast();
  const { domains, loading, error, refetch, deleteDomain } = useCustomDomains();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<CustomDomain | null>(null);

  const handleEdit = (domain: CustomDomain) => {
    setEditingDomain(domain);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingDomain(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (domain: CustomDomain) => {
    try {
      await deleteDomain(domain.id);
      toast({
        title: 'Domain deleted',
        description: `${domain.domain} has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete domain. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'DNS record copied to clipboard.',
    });
  };

  const getStatusBadge = (domain: CustomDomain) => {
    if (domain.is_verified && domain.ssl_status === 'active') {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
    }
    if (domain.is_verified) {
      return <Badge variant="secondary">Verified</Badge>;
    }
    if (domain.dns_configured) {
      return <Badge variant="outline">DNS Configured</Badge>;
    }
    return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Custom Domains</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Connect your own domain to your profile or opportunities
            </p>
          </div>
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Error loading domains: {error}
              </p>
            </div>
          )}

          {domains.length === 0 ? (
            <div className="text-center py-8">
              <ExternalLink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No custom domains</h3>
              <p className="text-gray-600 mb-4">
                Connect your own domain to create a branded experience for your visitors.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Domain
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {domains.map((domain) => (
                <div key={domain.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{domain.domain}</h4>
                      {getStatusBadge(domain)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(domain)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(domain)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    Target: {domain.target_type === 'profile' ? 'Profile' : `Opportunity: ${domain.target_opportunity_id}`}
                  </div>

                  {!domain.is_verified && domain.verification_token && (
                    <div className="bg-gray-50 rounded p-3 mt-3">
                      <h5 className="font-medium text-sm mb-2">DNS Configuration Required</h5>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between bg-white p-2 rounded border">
                          <span className="font-mono">TXT {domain.domain}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(domain.verification_token!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-gray-600">
                          Add this TXT record to verify domain ownership.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CustomDomainDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingDomain(null);
        }}
        domain={editingDomain}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
          setEditingDomain(null);
        }}
      />
    </>
  );
};
