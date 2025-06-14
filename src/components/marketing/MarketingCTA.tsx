
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

  const handleContactSales = () => {
    navigate('/dashboard#messages');
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
                Join the Revolution
              </div>
              
              <h2 className="text-4xl sm:text-6xl font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              
              <p className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                Join thousands of professionals who've already revolutionized their job search with LetsGetWork
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Free Today
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              
              <Button 
                onClick={handleContactSales}
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-10 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Contact Sales
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

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 text-white/80">
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

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg">
            Questions? Contact our team at{' '}
            <a href="mailto:hello@letsgetwork.com" className="text-blue-600 hover:text-blue-700 font-medium">
              hello@letsgetwork.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
