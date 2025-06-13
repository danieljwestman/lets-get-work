
import React from 'react';
import { Mail, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Profile, ProfileFormData } from '../types/profileTypes';
import { formatMemberSince } from '../utils/formatters';
import { TIMEZONE_OPTIONS } from '../constants/timezoneOptions';

interface ProfileFormFieldsProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  profile: Profile | null;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({ formData, setFormData, profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-50 pl-10"
          />
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          value={formData.timezone}
          onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
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
          onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assistant_name">Assistant Name</Label>
        <Input
          id="assistant_name"
          type="text"
          value={formData.assistant_name}
          onChange={(e) => setFormData(prev => ({ ...prev, assistant_name: e.target.value }))}
          placeholder="Enter assistant name"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-500">Member Since</Label>
        <div className="flex items-center gap-3 text-gray-500 pt-2">
          <UserCheck className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{profile?.created_at ? formatMemberSince(profile.created_at) : 'Not available'}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="intro_video_url_en">Intro Video URL (English)</Label>
        <Input
          id="intro_video_url_en"
          type="url"
          value={formData.intro_video_url_en}
          onChange={(e) => setFormData(prev => ({ ...prev, intro_video_url_en: e.target.value }))}
          placeholder="https://www.tella.tv/video/..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="intro_video_url_sv">Intro Video URL (Swedish)</Label>
        <Input
          id="intro_video_url_sv"
          type="url"
          value={formData.intro_video_url_sv}
          onChange={(e) => setFormData(prev => ({ ...prev, intro_video_url_sv: e.target.value }))}
          placeholder="https://www.tella.tv/video/..."
        />
      </div>

      {/* Unified Video URL Description */}
      <div className="md:col-span-2 -mt-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Supported platforms:</strong> Tella.tv, YouTube, Vimeo, Loom. Use the shareable/embed URL from your video platform.
            <br />
            <strong>Examples:</strong> https://www.tella.tv/video/abc123, https://youtube.com/watch?v=abc123, https://vimeo.com/123456789
          </p>
        </div>
      </div>
    </div>
  );
};
