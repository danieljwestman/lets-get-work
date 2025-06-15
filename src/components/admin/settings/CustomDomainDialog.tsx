
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { CustomDomainsService, type CustomDomain } from '@/services/customDomainsService';

interface CustomDomainDialogProps {
  isOpen: boolean;
  onClose: () => void;
  domain?: CustomDomain | null;
  onSuccess: () => void;
}

export const CustomDomainDialog: React.FC<CustomDomainDialogProps> = ({
  isOpen,
  onClose,
  domain,
  onSuccess
}) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    domain: '',
    target_type: 'profile' as 'profile' | 'opportunity',
    target_opportunity_id: 'default'
  });

  useEffect(() => {
    if (domain) {
      setFormData({
        domain: domain.domain,
        target_type: domain.target_type,
        target_opportunity_id: domain.target_opportunity_id || 'default'
      });
    } else {
      setFormData({
        domain: '',
        target_type: 'profile',
        target_opportunity_id: 'default'
      });
    }
  }, [domain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const domainData = {
        ...formData,
        target_profile_id: profile?.profile_id || '',
        target_opportunity_id: formData.target_type === 'opportunity' ? formData.target_opportunity_id : undefined
      };

      if (domain) {
        await CustomDomainsService.updateDomain(domain.id, domainData);
        toast({
          title: 'Domain updated',
          description: 'Your custom domain has been updated successfully.',
        });
      } else {
        await CustomDomainsService.createDomain(domainData as CustomDomain);
        toast({
          title: 'Domain added',
          description: 'Your custom domain has been added. Please configure DNS as shown.',
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save domain. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateDomain = (domain: string) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const isFormValid = validateDomain(formData.domain) && profile?.profile_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {domain ? 'Edit Custom Domain' : 'Add Custom Domain'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="example.com"
              disabled={loading || !!domain}
            />
            {formData.domain && !validateDomain(formData.domain) && (
              <p className="text-sm text-red-600 mt-1">Please enter a valid domain name</p>
            )}
          </div>

          <div>
            <Label htmlFor="target_type">Target Type</Label>
            <Select
              value={formData.target_type}
              onValueChange={(value: 'profile' | 'opportunity') => 
                setFormData({ ...formData, target_type: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile">Profile (Main page)</SelectItem>
                <SelectItem value="opportunity">Specific Opportunity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.target_type === 'opportunity' && (
            <div>
              <Label htmlFor="opportunity_id">Opportunity</Label>
              <Select
                value={formData.target_opportunity_id}
                onValueChange={(value) => 
                  setFormData({ ...formData, target_opportunity_id: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Opportunity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {!profile?.profile_id && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-700">
                You need to set up your profile ID before adding custom domains.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || loading}>
              {loading ? 'Saving...' : domain ? 'Update Domain' : 'Add Domain'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
