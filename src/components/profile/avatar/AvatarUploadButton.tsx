
import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvatarUploadButtonProps {
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarUploadButton: React.FC<AvatarUploadButtonProps> = ({ 
  uploading, 
  onFileChange 
}) => {
  return (
    <>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onFileChange}
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
  );
};
