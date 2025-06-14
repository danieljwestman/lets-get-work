
import React from 'react';
import { User, Palette, Briefcase } from 'lucide-react';
import { OnboardingStep } from './OnboardingStep';

interface OnboardingMainStepsProps {
  onNavigateToStep: (step: string) => void;
}

export const OnboardingMainSteps: React.FC<OnboardingMainStepsProps> = ({ onNavigateToStep }) => {
  const steps = [
    {
      step: 1,
      target: 'profile',
      title: 'Build Your Professional Personas',
      description: 'Create multiple tailored profiles showcasing different aspects of your expertise',
      icon: User,
      gradientFrom: 'from-blue-100',
      gradientTo: 'to-blue-50',
      hoverBorder: 'hover:border-blue-300',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600'
    },
    {
      step: 2,
      target: 'themes',
      title: 'Design Stunning Presentations',
      description: 'Choose from beautiful themes that reflect your personal brand and industry',
      icon: Palette,
      gradientFrom: 'from-purple-100',
      gradientTo: 'to-purple-50',
      hoverBorder: 'hover:border-purple-300',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600'
    },
    {
      step: 3,
      target: 'opportunities',
      title: 'Launch Your Campaigns',
      description: 'Create targeted opportunities and share personalized links with employers',
      icon: Briefcase,
      gradientFrom: 'from-pink-100',
      gradientTo: 'to-pink-50',
      hoverBorder: 'hover:border-pink-300',
      iconColor: 'text-pink-600',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Setup</h3>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((stepData) => (
          <OnboardingStep
            key={stepData.step}
            {...stepData}
            onClick={() => onNavigateToStep(stepData.target)}
          />
        ))}
      </div>
    </div>
  );
};
