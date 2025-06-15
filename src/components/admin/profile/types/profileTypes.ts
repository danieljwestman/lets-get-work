
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  profile_id: string | null;
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

export interface ProfileFormData {
  email: string;
  full_name: string;
  profile_id: string;
  timezone: string;
  birth_date: string;
  assistant_name: string;
  intro_video_url_en: string;
  intro_video_url_sv: string;
}
