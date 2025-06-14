
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
  const [key, setKey] = useState(0); // Force re-render key

  // Update local avatar URL when profile changes
  useEffect(() => {
    const newAvatarUrl = profile?.avatar_url || null;
    setAvatarUrl(newAvatarUrl);
    // Force re-render to ensure image cache is bypassed
    setKey(prev => prev + 1);
  }, [profile?.avatar_url]);

  const handleUploadSuccess = async (newAvatarUrl: string) => {
    // Update profile in database
    await updateProfile({ avatar_url: newAvatarUrl });
    
    // Update local state immediately
    setAvatarUrl(newAvatarUrl);
    setKey(prev => prev + 1);
    
    // Refetch profile to ensure consistency across all components
    await refetch();
    
    // Dispatch a custom event to notify other avatar components
    window.dispatchEvent(new CustomEvent('avatar-updated', { 
      detail: { avatarUrl: newAvatarUrl } 
    }));
  };

  const { uploading, handleFileUpload } = useAvatarUpload({
    userId: user?.id || '',
    currentAvatarUrl: profile?.avatar_url || null,
    onUploadSuccess: handleUploadSuccess,
    onAvatarUrlChange: setAvatarUrl
  });

  // Listen for avatar updates from other components
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      setAvatarUrl(event.detail.avatarUrl);
      setKey(prev => prev + 1);
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate as EventListener);
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate as EventListener);
    };
  }, []);

  const getInitials = () => generateInitials(profile?.full_name, profile?.email);

  const handleAvatarClick = () => {
    if (editable && !uploading) {
      const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  };

  if (!user || !profile) {
    return (
      <Avatar className={AVATAR_SIZE_CLASSES[size]} key={key}>
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          U
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="relative">
      {editable && (
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileUpload}
          className="hidden"
          id="avatar-upload"
          disabled={uploading}
        />
      )}
      
      <div 
        className={`${editable ? 'cursor-pointer hover:opacity-75 transition-opacity' : ''}`}
        onClick={handleAvatarClick}
      >
        <Avatar className={AVATAR_SIZE_CLASSES[size]} key={key}>
          <AvatarImage 
            src={avatarUrl || undefined} 
            alt="Profile"
            key={`${avatarUrl}-${key}`} // Force image reload with key
          />
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
    </div>
  );
};
