
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatarProps, AVATAR_SIZE_CLASSES } from './avatar/types';
import { generateInitials } from './avatar/utils';
import { useAvatarUpload } from './avatar/useAvatarUpload';
import { AvatarUploadButton } from './avatar/AvatarUploadButton';

export const UserAvatar: React.FC<UserAvatarProps> = ({ size = 'md', editable = false }) => {
  const { profile, updateProfile, refetch } = useProfile();
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Update local avatar URL when profile changes
  useEffect(() => {
    setAvatarUrl(profile?.avatar_url || null);
  }, [profile?.avatar_url]);

  const handleUploadSuccess = async (newAvatarUrl: string) => {
    await updateProfile({ avatar_url: newAvatarUrl });
    await refetch();
  };

  const { uploading, handleFileUpload } = useAvatarUpload({
    userId: user?.id || '',
    currentAvatarUrl: profile?.avatar_url || null,
    onUploadSuccess: handleUploadSuccess,
    onAvatarUrlChange: setAvatarUrl
  });

  const getInitials = () => generateInitials(profile?.full_name, profile?.email);

  if (!user || !profile) {
    return (
      <Avatar className={AVATAR_SIZE_CLASSES[size]}>
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          U
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="relative">
      <Avatar className={AVATAR_SIZE_CLASSES[size]}>
        <AvatarImage src={avatarUrl || undefined} alt="Profile" />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <AvatarUploadButton 
          uploading={uploading}
          onFileChange={handleFileUpload}
        />
      )}
    </div>
  );
};
