
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { resizeImage, validateImageFile } from './utils';

interface UseAvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  onUploadSuccess: (newAvatarUrl: string) => Promise<void>;
  onAvatarUrlChange: (url: string) => void;
}

export const useAvatarUpload = ({ 
  userId, 
  currentAvatarUrl, 
  onUploadSuccess, 
  onAvatarUrlChange 
}: UseAvatarUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      console.log('Starting avatar upload for user:', userId);
      
      // Resize image before upload
      const resizedBlob = await resizeImage(file, 300, 300, 0.8);
      if (!resizedBlob) {
        throw new Error('Failed to resize image');
      }

      // Create file from blob
      const resizedFile = new File([resizedBlob], file.name, { type: 'image/jpeg' });

      // Generate unique filename
      const fileExt = 'jpg';
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      console.log('Uploading to path:', fileName);

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        try {
          const oldPath = currentAvatarUrl.split('/storage/v1/object/public/avatars/')[1];
          if (oldPath) {
            console.log('Deleting old avatar:', oldPath);
            await supabase.storage.from('avatars').remove([oldPath]);
          }
        } catch (error) {
          console.warn('Failed to delete old avatar:', error);
        }
      }

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, resizedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(uploadError.message);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Add cache busting parameter
      const cacheBustingUrl = `${publicUrl}?t=${Date.now()}`;

      // Update profile and local state
      await onUploadSuccess(cacheBustingUrl);
      onAvatarUrlChange(cacheBustingUrl);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to update your profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return {
    uploading,
    handleFileUpload
  };
};
