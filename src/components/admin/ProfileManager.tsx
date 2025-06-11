
import React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileHeader } from './profile/ProfileHeader';
import { BasicInfoCard } from './profile/BasicInfoCard';
import { PersonasCard } from './profile/PersonasCard';

export const ProfileManager: React.FC = () => {
  const { profile, loading, updateProfile } = useProfile();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader />
      <BasicInfoCard 
        profile={profile} 
        loading={loading} 
        updateProfile={updateProfile} 
      />
      <PersonasCard />
    </div>
  );
};
