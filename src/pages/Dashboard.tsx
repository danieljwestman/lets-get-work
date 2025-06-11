
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardAuth } from '@/components/admin/DashboardAuth';
import { OpportunityProvider } from "@/contexts/OpportunityContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const DashboardContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [hasMinimumDelay, setHasMinimumDelay] = useState(false);

  // Ensure minimum loading time for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMinimumDelay(true);
    }, 800); // 800ms minimum delay for dashboard

    return () => clearTimeout(timer);
  }, []);

  if (loading || !hasMinimumDelay) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard: User not authenticated, showing login screen');
    return <DashboardAuth />;
  }

  console.log('Dashboard: User is authenticated, showing admin layout');

  return (
    <ErrorBoundary>
      <OpportunityProvider>
        <LanguageProvider>
          <AdminLayout />
        </LanguageProvider>
      </OpportunityProvider>
    </ErrorBoundary>
  );
};

const Dashboard: React.FC = () => {
  console.log('Dashboard: Rendering dashboard');

  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
};

export default Dashboard;
