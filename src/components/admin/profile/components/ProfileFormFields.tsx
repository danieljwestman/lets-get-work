
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { timezoneOptions } from '../constants/timezoneOptions';
import { ProfileFormData, Profile } from '../types/profileTypes';

interface ProfileFormFieldsProps {
  formData: ProfileFormData;
  setFormData: (data: ProfileFormData) => void;
  profile: Profile | null;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  formData,
  setFormData,
  profile
}) => {
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateProfileId = (profileId: string) => {
    const profileIdRegex = /^[a-z0-9_-]+$/;
    return profileIdRegex.test(profileId) && profileId.length >= 3 && profileId.length <= 50;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          disabled
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500">Email cannot be changed</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => handleInputChange('full_name', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile_id">Profile ID</Label>
        <Input
          id="profile_id"
          value={formData.profile_id || ''}
          onChange={(e) => handleInputChange('profile_id', e.target.value.toLowerCase())}
          placeholder="your-profile-id"
        />
        {formData.profile_id && (
          <div className="text-xs space-y-1">
            {validateProfileId(formData.profile_id) ? (
              <p className="text-green-600">
                ✓ Your profile will be available at: <strong>{formData.profile_id}.letsget.work</strong>
              </p>
            ) : (
              <p className="text-red-600">
                Profile ID must be 3-50 characters, lowercase letters, numbers, hyphens, and underscores only
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          value={formData.timezone}
          onValueChange={(value) => handleInputChange('timezone', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {timezoneOptions.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="birth_date">Birth Date</Label>
        <Input
          id="birth_date"
          type="date"
          value={formData.birth_date}
          onChange={(e) => handleInputChange('birth_date', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assistant_name">Assistant Name</Label>
        <Input
          id="assistant_name"
          value={formData.assistant_name}
          onChange={(e) => handleInputChange('assistant_name', e.target.value)}
          placeholder="Career Assistant"
        />
      </div>

      <div className="md:col-span-2 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="intro_video_url_en">Intro Video URL (English)</Label>
          <Input
            id="intro_video_url_en"
            type="url"
            value={formData.intro_video_url_en}
            onChange={(e) => handleInputChange('intro_video_url_en', e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="intro_video_url_sv">Intro Video URL (Swedish)</Label>
          <Input
            id="intro_video_url_sv"
            type="url"
            value={formData.intro_video_url_sv}
            onChange={(e) => handleInputChange('intro_video_url_sv', e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>
    </div>
  );
};
