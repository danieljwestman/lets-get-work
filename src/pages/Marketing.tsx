
import React from 'react';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { OnboardingShowcase } from '@/components/marketing/OnboardingShowcase';
import { FeaturesGrid } from '@/components/marketing/FeaturesGrid';
import { MarketingCTA } from '@/components/marketing/MarketingCTA';
import { FloatingBubbles } from '@/components/shared/FloatingBubbles';
import { Footer } from '@/components/Footer';

const Marketing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <FloatingBubbles />
      
      <MarketingHero />
      <OnboardingShowcase />
      <FeaturesGrid />
      <MarketingCTA />
      <Footer />
    </div>
  );
};

export default Marketing;
