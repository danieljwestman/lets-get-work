
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketingHero: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleViewDemo = () => {
    navigate('/marketing#onboarding');
  };

  return (
    <section className="relative px-4 sm:px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl text-center">
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LetsGetWork
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full text-sm font-medium text-blue-700 mb-8">
            <Zap className="h-4 w-4" />
            The Future of Job Applications
          </div>
        </div>

        {/* Main Headline */}
        <h2 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6">
          <span className="block">Land Your</span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dream Job
          </span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Transform how you present yourself to employers with personalized profiles, 
          stunning themes, and powerful analytics that track your success.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            onClick={handleViewDemo}
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 hover:border-purple-400 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            View Demo
          </Button>
        </div>

        {/* Social Proof */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10x</div>
            <div className="text-gray-600">Higher Response Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">User Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">24h</div>
            <div className="text-gray-600">Average Response Time</div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 hidden lg:block">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-float-1"></div>
        </div>
        <div className="absolute top-40 right-20 hidden lg:block">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-float-2"></div>
        </div>
        <div className="absolute bottom-20 left-20 hidden lg:block">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full opacity-20 animate-float-3"></div>
        </div>
      </div>
    </section>
  );
};
