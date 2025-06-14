
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { OnboardingHeader } from './onboarding/OnboardingHeader';
import { OnboardingMainSteps } from './onboarding/OnboardingMainSteps';
import { OnboardingAdvancedFeatures } from './onboarding/OnboardingAdvancedFeatures';
import { OnboardingSuccessMessage } from './onboarding/OnboardingSuccessMessage';

export const OnboardingShowcase: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToStep = (step: string) => {
    navigate(`/dashboard#${step}`);
  };

  return (
    <section id="onboarding" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <OnboardingHeader />

        {/* Onboarding Tutorial Card */}
        <Card className="overflow-hidden shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="space-y-8">
              <OnboardingMainSteps onNavigateToStep={handleNavigateToStep} />
              <OnboardingAdvancedFeatures onNavigateToStep={handleNavigateToStep} />
              <OnboardingSuccessMessage />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
