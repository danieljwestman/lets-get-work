
import React from 'react';
import { HelpCircle, User, Palette, Briefcase, BarChart3, Mail, ArrowRight, CheckCircle, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const HelpSupportManager: React.FC = () => {
  const { toast } = useToast();

  const handleNavigateToStep = (step: string) => {
    // Navigate to the dashboard with proper routing
    window.location.href = `/dashboard#${step}`;
  };

  const handleGetSupport = () => {
    toast({
      title: "Support Coming Soon",
      description: "We're currently in closed beta and preparing an amazing support experience. Stay tuned for updates!",
      variant: "info"
    });
  };

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
        <Button onClick={handleGetSupport} className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Get Support
        </Button>
      </div>

      {/* Onboarding Tutorial Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b">
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🚀 Get Started with Your Job Hunt
            </CardTitle>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to set up your professional presence and start landing your dream opportunities
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Main Setup Steps */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Setup (3 steps)</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Profile */}
              <div 
                onClick={() => handleNavigateToStep('profile')}
                className="group cursor-pointer"
              >
                <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-blue-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Build Your Profile & Personas</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Create compelling professional personas that showcase your skills and experience
                      </p>
                      <div className="flex items-center justify-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                        <span className="text-sm font-medium">Start Building</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 2: Themes */}
              <div 
                onClick={() => handleNavigateToStep('themes')}
                className="group cursor-pointer"
              >
                <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-purple-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                        <Palette className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Customize Your Presentation</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Design beautiful themes that reflect your personal brand and style
                      </p>
                      <div className="flex items-center justify-center gap-2 text-purple-600 group-hover:text-purple-700 transition-colors">
                        <span className="text-sm font-medium">Design Themes</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 3: Opportunities */}
              <div 
                onClick={() => handleNavigateToStep('opportunities')}
                className="group cursor-pointer"
              >
                <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-pink-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center group-hover:from-pink-200 group-hover:to-pink-300 transition-all duration-300">
                        <Briefcase className="h-8 w-8 text-pink-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Add & Share Opportunities</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Create campaigns and share personalized links with potential employers
                      </p>
                      <div className="flex items-center justify-center gap-2 text-pink-600 group-hover:text-pink-700 transition-colors">
                        <span className="text-sm font-medium">Create Campaigns</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="pt-8 border-t border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Features</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Analytics */}
                <div 
                  onClick={() => handleNavigateToStep('analytics')}
                  className="group cursor-pointer"
                >
                  <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-green-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                          <BarChart3 className="h-7 w-7 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Track with Analytics</h4>
                          <p className="text-sm text-gray-600">
                            Monitor engagement, views, and interest from potential employers
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Messages */}
                <div 
                  onClick={() => handleNavigateToStep('messages')}
                  className="group cursor-pointer"
                >
                  <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-teal-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-300">
                          <Mail className="h-7 w-7 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Manage Messages</h4>
                          <p className="text-sm text-gray-600">
                            Communicate directly with companies and track all conversations
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-teal-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Complete all steps to maximize your job search success!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
