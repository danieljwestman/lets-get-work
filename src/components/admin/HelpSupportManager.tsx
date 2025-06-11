
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const HelpSupportManager: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header with icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600 mt-1">
              Get assistance, find answers to your questions, and access resources
            </p>
          </div>
        </div>
      </div>

      {/* Help & Support Card */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Support Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Great Support Coming Your Way! 🚀</h3>
                <p className="text-green-700 mb-4">
                  We're building an amazing support experience for you during the beta period. Your feedback helps us create the best possible service.
                </p>
                <div className="bg-white p-4 rounded-md border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">🛠️ Coming Soon</h4>
                  <p className="text-gray-600 text-sm">
                    We're preparing comprehensive help documentation, live chat support, video tutorials, and a knowledge base to help you succeed!
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Need immediate help?</strong> During the beta period, feel free to reach out through the contact form. 
                  We're here to help you make the most of your experience!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
