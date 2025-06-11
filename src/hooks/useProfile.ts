import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  created_at: string;
  updated_at: string;
}

interface DatabaseProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  timezone?: string | null;
  avatar_url?: string | null;
  debug_tools_enabled?: boolean | null;
  notification_preferences?: any | null;
  birth_date?: string | null;
  assistant_name?: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching profile for user:', user.id);
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        setError(fetchError.message);
        setProfile(null);
      } else {
        console.log('Profile fetched successfully:', data);
        // Ensure timezone has a default value if null
        const profileData: Profile = {
          ...data,
          timezone: (data as DatabaseProfile).timezone || 'Europe/Stockholm',
          avatar_url: (data as DatabaseProfile).avatar_url || null,
          debug_tools_enabled: (data as DatabaseProfile).debug_tools_enabled || false,
          notification_preferences: (data as DatabaseProfile).notification_preferences || null,
          birth_date: (data as DatabaseProfile).birth_date || null,
          assistant_name: (data as DatabaseProfile).assistant_name || 'Career Assistant'
        };
        setProfile(profileData);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: { 
    full_name?: string; 
    email?: string; 
    timezone?: string;
    avatar_url?: string;
    debug_tools_enabled?: boolean;
    notification_preferences?: any;
    birth_date?: string;
    assistant_name?: string;
  }) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      console.log('Updating profile with:', updates);
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error(updateError.message);
      }

      console.log('Profile updated successfully:', data);
      // Ensure timezone has a default value if null
      const profileData: Profile = {
        ...data,
        timezone: (data as DatabaseProfile).timezone || 'Europe/Stockholm',
        avatar_url: (data as DatabaseProfile).avatar_url || null,
        debug_tools_enabled: (data as DatabaseProfile).debug_tools_enabled || false,
        notification_preferences: (data as DatabaseProfile).notification_preferences || null,
        birth_date: (data as DatabaseProfile).birth_date || null,
        assistant_name: (data as DatabaseProfile).assistant_name || 'Career Assistant'
      };
      setProfile(profileData);
      return profileData;
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('Updating user password');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        throw new Error(error.message);
      }

      console.log('Password updated successfully');
    } catch (err: any) {
      console.error('Failed to update password:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePassword,
    refetch: fetchProfile,
  };
};
