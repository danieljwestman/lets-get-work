
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const MarketingHero: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleViewDemo = () => {
    toast({
      title: "Demo Coming Soon",
      description: "We're currently in closed beta and preparing an amazing demo experience. Stay tuned for updates!",
      variant: "info"
    });
  };

  return (
    <section className="relative px-4 sm:px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl text-center">
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="inline-flex flex-col items-center gap-3 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LetsGetWork
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full text-sm font-medium text-blue-700">
              <Zap className="h-4 w-4" />
              The Future of Job Hunting (beta)
            </div>
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
          Build your professional digital presence — with a customizable profiles, 
          striking designs, and powerful tracking tools for your opportunities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Button 
            onClick={handleViewDemo}
            variant="outline"
            size="lg"
            className="relative bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0 overflow-hidden group"
          >
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-md p-[2px] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              <div className="flex h-full w-full items-center justify-center rounded-md bg-white/90 backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-blue-50/90 group-hover:to-purple-50/90 transition-all duration-300">
              </div>
            </div>
            
            {/* Button content with gradient text */}
            <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              View Demo
            </span>
          </Button>
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
