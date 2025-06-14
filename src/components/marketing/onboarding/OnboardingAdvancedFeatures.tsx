
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Mail, ArrowRight } from 'lucide-react';

interface OnboardingAdvancedFeaturesProps {
  onNavigateToStep: (step: string) => void;
}

export const OnboardingAdvancedFeatures: React.FC<OnboardingAdvancedFeaturesProps> = ({ onNavigateToStep }) => {
  return (
    <div className="pt-8 border-t border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Track & Optimize</h3>
        <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Analytics */}
        <div onClick={() => onNavigateToStep('analytics')} className="group cursor-pointer">
          <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-green-300 bg-gradient-to-br from-white to-green-50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                  <BarChart3 className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Real-Time Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Monitor views, engagement, and employer interest across all your campaigns
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        <div onClick={() => onNavigateToStep('messages')} className="group cursor-pointer">
          <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-teal-300 bg-gradient-to-br from-white to-teal-50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-300">
                  <Mail className="h-7 w-7 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Direct Communication</h4>
                  <p className="text-sm text-gray-600">
                    Connect with employers and manage all conversations in one place
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
