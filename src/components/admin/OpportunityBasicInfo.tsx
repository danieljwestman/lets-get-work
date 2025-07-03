
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Target, Building2, Lock, Shield, Video } from 'lucide-react';
import { useThemesData } from './hooks/useThemesData';
import { OPPORTUNITY_STATUSES, type OpportunityStatusType } from '@/constants/opportunityStatuses';
import type { Opportunity } from '@/types/admin';

interface OpportunityBasicInfoProps {
  opportunity: Opportunity;
  onChange: (updates: Partial<Opportunity>) => void;
}

export const OpportunityBasicInfo: React.FC<OpportunityBasicInfoProps> = ({ 
  opportunity, 
  onChange 
}) => {
  const { themes } = useThemesData();
  const isDefaultOpportunity = opportunity.opportunity_id === 'default';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Opportunity Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="opportunity_id" className="flex items-center gap-2">
                Opportunity ID
                {isDefaultOpportunity && <Lock className="h-3 w-3 text-gray-400" />}
              </Label>
              <Input
                id="opportunity_id"
                value={opportunity.opportunity_id}
                onChange={(e) => onChange({ opportunity_id: e.target.value })}
                placeholder="e.g., company-role-2024"
                className="font-mono"
                disabled={isDefaultOpportunity}
              />
              <p className="text-xs text-gray-500">
                {isDefaultOpportunity 
                  ? "Default opportunity ID cannot be changed"
                  : "Unique identifier (will be used in URLs)"
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Opportunity Name</Label>
              <Input
                id="name"
                value={opportunity.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="e.g., Senior Developer at TechCorp"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme_id">Theme</Label>
              <Select
                value={opportunity.theme_id}
                onValueChange={(value) => onChange({ theme_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.theme_id} value={theme.theme_id}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={opportunity.status}
                onValueChange={(value: OpportunityStatusType) => onChange({ status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPPORTUNITY_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode_protection" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Passcode Protection
              </Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="passcode_protection"
                  checked={opportunity.is_passcode_protected || false}
                  onCheckedChange={(checked) => onChange({ 
                    is_passcode_protected: checked,
                    access_passcode: checked ? opportunity.access_passcode : ''
                  })}
                />
                <Label htmlFor="passcode_protection" className="text-sm text-gray-600">
                  Require passcode to access this opportunity
                </Label>
              </div>
            </div>

            {opportunity.is_passcode_protected && (
              <div className="space-y-2">
                <Label htmlFor="access_passcode" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Access Passcode
                </Label>
                <Input
                  id="access_passcode"
                  type="text"
                  value={opportunity.access_passcode || ''}
                  onChange={(e) => onChange({ access_passcode: e.target.value })}
                  placeholder="Enter a simple passcode (e.g., 1234, hello, welcome)"
                  className="max-w-md"
                />
                <p className="text-xs text-gray-500">
                  Keep it simple and easy to share. Visitors can access with ?passcode=XXX in the URL.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={opportunity.company_name || ''}
                onChange={(e) => onChange({ company_name: e.target.value })}
                placeholder="e.g., TechCorp Inc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={opportunity.contact_person || ''}
                onChange={(e) => onChange({ contact_person: e.target.value })}
                placeholder="e.g., John Smith"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_role">Target Role</Label>
            <Input
              id="target_role"
              value={opportunity.target_role || ''}
              onChange={(e) => onChange({ target_role: e.target.value })}
              placeholder="e.g., Senior Full Stack Developer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={opportunity.notes || ''}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Internal notes about this opportunity..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intro_video_url_en">Introduction Video URL (English)</Label>
              <Input
                id="intro_video_url_en"
                type="url"
                value={opportunity.intro_video_url_en || ''}
                onChange={(e) => onChange({ intro_video_url_en: e.target.value })}
                placeholder="e.g., https://tella.tv/video/xxxxx, https://youtube.com/watch?v=xxxxx"
              />
              <p className="text-xs text-gray-500">
                Supports Tella.tv, YouTube, Vimeo, and Loom URLs. Leave blank to use profile video.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="intro_video_url_sv">Introduction Video URL (Swedish)</Label>
              <Input
                id="intro_video_url_sv"
                type="url"
                value={opportunity.intro_video_url_sv || ''}
                onChange={(e) => onChange({ intro_video_url_sv: e.target.value })}
                placeholder="e.g., https://tella.tv/video/xxxxx, https://youtube.com/watch?v=xxxxx"
              />
              <p className="text-xs text-gray-500">
                Supports Tella.tv, YouTube, Vimeo, and Loom URLs. Leave blank to use profile video.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
