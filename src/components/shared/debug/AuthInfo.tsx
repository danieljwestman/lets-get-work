
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Badge } from '@/components/ui/badge';

export const AuthInfo: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const getAuthStatusBadgeVariant = (isAuthenticated: boolean) => {
    return isAuthenticated ? 'secondary' : 'outline';
  };

  return (
    <div className="p-4">
      {authLoading ? (
        <div className="text-gray-500 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin flex-shrink-0"></div>
          Loading auth state...
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
            <span className="text-gray-600 font-medium">Status:</span>
            <Badge variant={getAuthStatusBadgeVariant(!!user)} className="text-xs w-fit bg-gray-100 text-gray-700 border-gray-200">
              {user ? 'AUTHENTICATED' : 'GUEST'}
            </Badge>
          </div>

          {user && (
            <>
              <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                <span className="text-gray-600 font-medium">User ID:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 break-all">
                  {user.id}
                </code>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800 text-xs break-all">
                  {user.email}
                </span>
              </div>

              {profile && !profileLoading && (
                <>
                  {profile.full_name && (
                    <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                      <span className="text-gray-600 font-medium">Name:</span>
                      <span className="text-gray-800 text-xs break-words">
                        {profile.full_name}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                    <span className="text-gray-600 font-medium">Timezone:</span>
                    <span className="text-gray-800 text-xs">
                      {profile.timezone}
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
