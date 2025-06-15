
import React from 'react';
import { Mail, Globe, User, Bot, UserCheck, Video, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { Profile, ProfileFormData } from '../types/profileTypes';
import { formatVideoUrlDisplay } from '../utils/videoUtils';
import { getTimezoneLabel, formatMemberSince, formatBirthDate } from '../utils/formatters';
import { timezoneOptions } from '../constants/timezoneOptions';

interface ProfileDisplayModeProps {
  formData: ProfileFormData;
  profile: Profile | null;
}

export const ProfileDisplayMode: React.FC<ProfileDisplayModeProps> = ({ formData, profile }) => {
  return (
    <div className="flex items-start gap-20">
      {/* Avatar Section */}
      <div className="flex-shrink-0">
        <UserAvatar size="lg" editable={false} />
        <div className="text-xs text-gray-500 mt-2 text-center max-w-[80px]">
          Default avatar
        </div>
      </div>
      
      {/* User Information Grid */}
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-3">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <div className="flex items-center gap-3 text-gray-900">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{formData.email || 'Not set'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Full Name</Label>
            <div className="flex items-center gap-3 text-gray-900">
              <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{formData.full_name || 'Not set'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Timezone</Label>
            <div className="flex items-center gap-3 text-gray-900">
              <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{getTimezoneLabel(formData.timezone, timezoneOptions)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Birth Date</Label>
            <div className="flex items-center gap-3 text-gray-900">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{formatBirthDate(formData.birth_date)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Assistant Name</Label>
            <div className="flex items-center gap-3 text-gray-900">
              <Bot className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{formData.assistant_name || 'Career Assistant'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Member Since</Label>
            <div className="flex items-center gap-3 text-gray-900">
              <UserCheck className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{profile?.created_at ? formatMemberSince(profile.created_at) : 'Not available'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Intro Video (English)</Label>
            <div className="flex items-center gap-3 text-gray-900">
              <Video className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{formatVideoUrlDisplay(formData.intro_video_url_en)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">Intro Video (Swedish)</Label>
            <div className="flex items-center gap-3 text-gray-900">
              <Video className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{formatVideoUrlDisplay(formData.intro_video_url_sv)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
