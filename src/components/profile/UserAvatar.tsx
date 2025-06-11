
import React, { useState } from 'react';
import { User, Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ size = 'md', editable = false }) => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-20 w-20'
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    // For now, we'll just simulate upload and use a placeholder
    // In a real implementation, you'd upload to Supabase Storage
    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just use a placeholder URL
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name || profile.email}`;
      
      await updateProfile({ avatar_url: avatarUrl });
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to update your profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="avatar-upload"
            disabled={uploading}
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1"
          >
            <Button
              size="sm"
              className="h-6 w-6 p-0 rounded-full shadow-lg"
              disabled={uploading}
            >
              {uploading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </Button>
          </label>
        </>
      )}
    </div>
  );
};
