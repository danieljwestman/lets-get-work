
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Palette, Briefcase, BarChart3, Mail, ArrowRight, CheckCircle, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OnboardingShowcase: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToStep = (step: string) => {
    navigate(`/dashboard#${step}`);
  };

  return (
    <section id="onboarding" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-teal-50 rounded-full text-green-700 text-sm font-medium mb-6">
            <PlayCircle className="h-4 w-4" />
            Interactive Demo
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Get Started in
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow our proven framework to create compelling job applications that get noticed by top employers
          </p>
        </div>

        {/* Onboarding Tutorial Card */}
        <Card className="overflow-hidden shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b">
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🚀 Your Path to Success
              </CardTitle>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Transform your job search with our step-by-step guidance system
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Main Setup Steps */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Setup</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1: Profile */}
                <div 
                  onClick={() => handleNavigateToStep('profile')}
                  className="group cursor-pointer"
                >
                  <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50">
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
                        <h4 className="font-semibold text-gray-900 mb-2">Build Your Professional Personas</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Create multiple tailored profiles showcasing different aspects of your expertise
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
                  <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50">
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
                        <h4 className="font-semibold text-gray-900 mb-2">Design Stunning Presentations</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Choose from beautiful themes that reflect your personal brand and industry
                        </p>
                        <div className="flex items-center justify-center gap-2 text-purple-600 group-hover:text-purple-700 transition-colors">
                          <span className="text-sm font-medium">Customize Design</span>
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
                  <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-pink-300 bg-gradient-to-br from-white to-pink-50">
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
                        <h4 className="font-semibold text-gray-900 mb-2">Launch Your Campaigns</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Create targeted opportunities and share personalized links with employers
                        </p>
                        <div className="flex items-center justify-center gap-2 text-pink-600 group-hover:text-pink-700 transition-colors">
                          <span className="text-sm font-medium">Start Sharing</span>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Track & Optimize</h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Analytics */}
                  <div 
                    onClick={() => handleNavigateToStep('analytics')}
                    className="group cursor-pointer"
                  >
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
                  <div 
                    onClick={() => handleNavigateToStep('messages')}
                    className="group cursor-pointer"
                  >
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

              {/* Success Message */}
              <div className="text-center pt-6">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-teal-50 text-green-700 rounded-full text-sm font-medium">
                  <CheckCircle className="h-5 w-5" />
                  Join thousands who've transformed their job search
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
