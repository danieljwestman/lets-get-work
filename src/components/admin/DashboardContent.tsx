
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { MessagesTable } from './MessagesTable';
import { ThemesManager } from './ThemesManager';
import { OpportunitiesManager } from './OpportunitiesManager';
import { ProfileManager } from './ProfileManager';
import { SettingsManager } from './SettingsManager';
import { BillingManager } from './BillingManager';
import { HelpSupportManager } from './HelpSupportManager';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export const DashboardContent: React.FC = () => {
  console.log('DashboardContent: Rendering dashboard content');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <TabsContent value="analytics" className="mt-0">
        <ErrorBoundary>
          <AnalyticsDashboard />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="messages" className="mt-0">
        <ErrorBoundary>
          <MessagesTable />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="profile" className="mt-0">
        <ErrorBoundary>
          <ProfileManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="opportunities" className="mt-0">
        <ErrorBoundary>
          <OpportunitiesManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="themes" className="mt-0">
        <ErrorBoundary>
          <ThemesManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="settings" className="mt-0">
        <ErrorBoundary>
          <SettingsManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="billing" className="mt-0">
        <ErrorBoundary>
          <BillingManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="help-support" className="mt-0">
        <ErrorBoundary>
          <HelpSupportManager />
        </ErrorBoundary>
      </TabsContent>
    </div>
  );
};
