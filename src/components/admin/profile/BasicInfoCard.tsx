
import React from 'react';
import { Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Profile, ProfileFormData } from './types/profileTypes';
import { ProfileDisplayMode } from './components/ProfileDisplayMode';
import { ProfileEditMode } from './components/ProfileEditMode';

interface BasicInfoCardProps {
  profile: Profile | null;
  loading: boolean;
  updateProfile: (updates: any) => Promise<any>;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ profile, loading, updateProfile }) => {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  
  const [formData, setFormData] = React.useState<ProfileFormData>({
    email: '',
    full_name: '',
    timezone: 'Europe/Stockholm',
    birth_date: '',
    assistant_name: 'Career Assistant',
    intro_video_url_en: '',
    intro_video_url_sv: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        full_name: profile.full_name || '',
        timezone: profile.timezone || 'Europe/Stockholm',
        birth_date: profile.birth_date || '',
        assistant_name: profile.assistant_name || 'Career Assistant',
        intro_video_url_en: profile.intro_video_url_en || '',
        intro_video_url_sv: profile.intro_video_url_sv || ''
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        full_name: profile.full_name || '',
        timezone: profile.timezone || 'Europe/Stockholm',
        birth_date: profile.birth_date || '',
        assistant_name: profile.assistant_name || 'Career Assistant',
        intro_video_url_en: profile.intro_video_url_en || '',
        intro_video_url_sv: profile.intro_video_url_sv || ''
      });
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        full_name: formData.full_name,
        timezone: formData.timezone,
        birth_date: formData.birth_date || null,
        assistant_name: formData.assistant_name,
        intro_video_url_en: formData.intro_video_url_en || null,
        intro_video_url_sv: formData.intro_video_url_sv || null
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4 p-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
        <CardTitle>
          Basic Information
        </CardTitle>
        {!isEditing && (
          <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <ProfileDisplayMode formData={formData} profile={profile} />
        ) : (
          <ProfileEditMode
            formData={formData}
            setFormData={setFormData}
            profile={profile}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </CardContent>
    </Card>
  );
};
