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
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('AnalyticsDashboard Error:', error, errorInfo);
          }}
        >
          <AnalyticsDashboard />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="messages" className="mt-0">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('MessagesTable Error:', error, errorInfo);
          }}
        >
          <MessagesTable />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="profile" className="mt-0">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('ProfileManager Error:', error, errorInfo);
          }}
        >
          <ProfileManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="opportunities" className="mt-0">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('OpportunitiesManager Error:', error, errorInfo);
          }}
        >
          <OpportunitiesManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="themes" className="mt-0">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('ThemesManager Error:', error, errorInfo);
          }}
        >
          <ThemesManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="settings" className="mt-0">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('SettingsManager Error:', error, errorInfo);
          }}
        >
          <SettingsManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="billing" className="mt-0">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('BillingManager Error:', error, errorInfo);
          }}
        >
          <BillingManager />
        </ErrorBoundary>
      </TabsContent>

      <TabsContent value="help-support" className="mt-0">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('HelpSupportManager Error:', error, errorInfo);
          }}
        >
          <HelpSupportManager />
        </ErrorBoundary>
      </TabsContent>
    </div>
  );
};
