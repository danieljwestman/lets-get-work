
import React from 'react';
import { User } from 'lucide-react';

export const ProfileHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your profile and personas for personalized outreach experiences
          </p>
        </div>
      </div>
    </div>
  );
};
