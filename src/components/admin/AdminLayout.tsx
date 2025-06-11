
import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';

export const AdminLayout: React.FC = () => {
  const { signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState('analytics');

  // Handle initial hash and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['analytics', 'messages', 'profile', 'opportunities', 'themes', 'settings', 'billing', 'help-support'].includes(hash)) {
        setCurrentTab(hash);
      }
    };

    // Set initial tab from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLogout = async () => {
    console.log('AdminLayout: Logout clicked');
    try {
      await signOut();
      // The auth context will automatically redirect to login
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigate = (value: string) => {
    setCurrentTab(value);
    // Update URL hash without triggering a page reload
    window.history.replaceState(null, '', `#${value}`);
  };

  console.log('AdminLayout: Rendering admin layout');

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('AdminLayout Error:', error, errorInfo);
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <Tabs defaultValue="analytics" value={currentTab} onValueChange={handleNavigate} className="min-h-screen">
          <ErrorBoundary
            onError={(error, errorInfo) => {
              console.error('DashboardHeader Error:', error, errorInfo);
            }}
          >
            <DashboardHeader 
              onLogout={handleLogout} 
              currentValue={currentTab}
              onNavigate={handleNavigate}
            />
          </ErrorBoundary>
          <ErrorBoundary
            onError={(error, errorInfo) => {
              console.error('DashboardContent Error:', error, errorInfo);
            }}
          >
            <div className="pt-16">
              <DashboardContent />
            </div>
          </ErrorBoundary>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};
