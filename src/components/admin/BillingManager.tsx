
import React from 'react';
import { CreditCard, Gift, Bell, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

      {/* Current Plan Status - Enhanced Design */}
      <Card className="overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-10 bg-[url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%23ffffff\" fill-opacity=\"0.1\"><circle cx=\"30\" cy=\"30\" r=\"2\"/></g></g></svg>')]"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">Current Plan</CardTitle>
                <p className="text-blue-100 text-sm">Active since beta launch</p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Beta Plan Details */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-semibold">
                <Star className="h-5 w-5" />
                Free Beta Access
              </div>
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                You're part of our exclusive beta community! Enjoy <strong>unlimited access</strong> to all features 
                while we perfect the platform together.
              </p>
            </div>

            {/* Beta Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">All Features Included</h4>
                    <p className="text-sm text-gray-600">Complete access to the platform</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Early Access</h4>
                    <p className="text-sm text-gray-600">First to try new features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Coming Next */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            What's Coming Next
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Plans in Development</h3>
                <p className="text-gray-700 mb-4">
                  We're crafting exciting subscription tiers with enhanced features, advanced analytics, 
                  priority support, and exclusive tools to supercharge your job hunting success.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Advanced Analytics & Insights
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Priority Customer Support
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Premium Templates & Themes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Exclusive Beta Features
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Beta Promise - Removed blue background */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Our Beta Promise</h3>
              <p className="text-gray-700 text-sm max-w-lg mx-auto">
                <strong>All current features remain free during beta.</strong> You'll receive advance notice 
                before any paid plans launch, and beta users get special early-bird pricing.
              </p>
              <Button variant="outline" className="mt-4" disabled>
                <Bell className="h-4 w-4 mr-2" />
                Notifications Enabled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
