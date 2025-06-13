import React from 'react';
import { Mail, Calendar, Edit3, Check, X, Globe, User, Bot, UserCheck, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { useToast } from '@/hooks/use-toast';

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/Stockholm', label: 'Europe/Stockholm (CET/CEST)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT)' },
];

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  timezone: string | null;
  avatar_url: string | null;
  debug_tools_enabled: boolean | null;
  notification_preferences: any | null;
  birth_date: string | null;
  assistant_name: string | null;
  intro_video_url_en: string | null;
  intro_video_url_sv: string | null;
  created_at: string;
  updated_at: string;
}

interface BasicInfoCardProps {
  profile: Profile | null;
  loading: boolean;
  updateProfile: (updates: any) => Promise<any>;
}

// Helper function to format video URL for display
const formatVideoUrlDisplay = (url: string | null): string => {
  if (!url || url.trim() === '') return 'Not set';
  
  // Check for different video platforms
  if (url.includes('tella.tv')) {
    return 'Tella video available';
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'YouTube video available';
  }
  if (url.includes('vimeo.com')) {
    return 'Vimeo video available';
  }
  if (url.includes('loom.com')) {
    return 'Loom video available';
  }
  
  // Generic video URL
  return 'Video available';
};

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ profile, loading, updateProfile }) => {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
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

  const getTimezoneLabel = (value: string) => {
    const option = TIMEZONE_OPTIONS.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatBirthDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
          /* Display Mode */
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
                    <span>{getTimezoneLabel(formData.timezone)}</span>
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
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit}>
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
                    <p className="text-xs text-gray-500 mt-1">
                      Supported platforms: Tella.tv, YouTube, Vimeo, Loom. Use the shareable/embed URL from your video platform.
                    </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      Examples: https://www.tella.tv/video/abc123, https://youtube.com/watch?v=abc123, https://vimeo.com/123456789
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-12">
              <Button type="submit" disabled={saving} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
