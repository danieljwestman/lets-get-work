
import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvatarUploadButtonProps {
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarUploadButton: React.FC<AvatarUploadButtonProps> = ({ 
  uploading
}) => {
  return (
    <div className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1 h-6 w-6 rounded-full bg-primary shadow-lg flex items-center justify-center pointer-events-none">
      {uploading ? (
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Camera className="h-3 w-3 text-white" />
      )}
    </div>
  );
};
