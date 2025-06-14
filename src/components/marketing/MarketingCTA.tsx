
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketingCTA: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <section className="px-4 sm:px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Main CTA Card */}
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          
          <CardContent className="relative p-12 sm:p-20 text-center text-white">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4" />
                Trusted Choice
              </div>
              
              <h2 className="text-4xl sm:text-6xl font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              
              <p className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                Join thousands of professionals who've already revolutionized their job search with LetsGetWork
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mb-12">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-4 sm:px-10 sm:py-6 text-lg sm:text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Free Today
                <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center justify-center gap-3 text-white/90">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/90">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>14-Day Free Trial</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/90">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>Cancel Anytime</span>
              </div>
            </div>

            {/* Social Proof - Improved mobile layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">10,000+ Happy Users</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm ml-2">4.9/5 Rating</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
