
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const BillingManager: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header with icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
            <p className="text-gray-600 mt-1">
              Manage your subscription, billing information, and payment methods
            </p>
          </div>
        </div>
      </div>

      {/* Billing Card */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Subscription Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Currently Free (Beta)</h3>
                <p className="text-blue-700 mb-4">
                  You're using our service for free during the beta period. We're working hard to provide you with the best experience possible.
                </p>
                <div className="bg-white p-4 rounded-md border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-2">🚀 Coming Soon</h4>
                  <p className="text-gray-600 text-sm">
                    We're preparing exciting subscription plans with advanced features, enhanced analytics, and priority support. Stay tuned for updates!
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Note:</strong> All current features will remain available during the beta period. 
                  We'll notify you well in advance before introducing any paid plans.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
