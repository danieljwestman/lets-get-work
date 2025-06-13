
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { Profile, ProfileFormData } from '../types/profileTypes';
import { ProfileFormFields } from './ProfileFormFields';

interface ProfileEditModeProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  profile: Profile | null;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ProfileEditMode: React.FC<ProfileEditModeProps> = ({
  formData,
  setFormData,
  profile,
  saving,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-start gap-20">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <UserAvatar size="lg" editable={true} />
          <div className="text-xs text-gray-500 mt-2 text-center max-w-[80px]">
            Click to update
          </div>
        </div>
        
        {/* Form Fields */}
        <div className="flex-1 min-w-0 space-y-6">
          <ProfileFormFields
            formData={formData}
            setFormData={setFormData}
            profile={profile}
          />
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-12">
        <Button type="submit" disabled={saving} className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
};
