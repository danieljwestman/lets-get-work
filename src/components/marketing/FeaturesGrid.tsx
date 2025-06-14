
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, Globe, Palette, TrendingUp, Heart } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description: "Get your professional presence online in under 10 minutes with our guided setup process.",
      gradient: "from-yellow-100 to-orange-100",
      iconBg: "from-yellow-200 to-orange-200",
      iconColor: "text-orange-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with encrypted data storage and GDPR compliance for peace of mind.",
      gradient: "from-blue-100 to-indigo-100",
      iconBg: "from-blue-200 to-indigo-200",
      iconColor: "text-indigo-600"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Multi-language support and global templates to reach employers worldwide.",
      gradient: "from-green-100 to-emerald-100",
      iconBg: "from-green-200 to-emerald-200",
      iconColor: "text-emerald-600"
    },
    {
      icon: Palette,
      title: "Unlimited Customization",
      description: "Create stunning, pixel-perfect presentations with our advanced theme engine. Over 50+ professional templates and unlimited design possibilities to match your unique brand.",
      gradient: "from-purple-100 to-violet-100",
      iconBg: "from-purple-200 to-violet-200",
      iconColor: "text-violet-600"
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description: "Advanced analytics to understand what works and optimize your approach continuously.",
      gradient: "from-pink-100 to-rose-100",
      iconBg: "from-pink-200 to-rose-200",
      iconColor: "text-rose-600"
    },
    {
      icon: Heart,
      title: "Quick Support",
      description: "Dedicated support team and comprehensive resources to help you succeed at every step.",
      gradient: "from-red-100 to-pink-100",
      iconBg: "from-red-200 to-pink-200",
      iconColor: "text-pink-600"
    }
  ];

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Stand Out</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to give you a competitive edge in today's job market
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-gradient-to-br ${feature.gradient} group cursor-pointer`}
            >
              <CardContent className="p-8 space-y-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <div className="text-gray-600 font-medium">Applications Sent</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              89%
            </div>
            <div className="text-gray-600 font-medium">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              24h
            </div>
            <div className="text-gray-600 font-medium">Avg. Response</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              150+
            </div>
            <div className="text-gray-600 font-medium">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
};
