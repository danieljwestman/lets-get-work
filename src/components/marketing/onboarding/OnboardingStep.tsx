
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface OnboardingStepProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradientFrom: string;
  gradientTo: string;
  hoverBorder: string;
  iconColor: string;
  textColor: string;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  step,
  title,
  description,
  icon: Icon,
  onClick,
  gradientFrom,
  gradientTo,
  hoverBorder,
  iconColor,
  textColor
}) => {
  return (
    <div onClick={onClick} className="group cursor-pointer">
      <Card className={`h-full transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${hoverBorder} bg-gradient-to-br from-white ${gradientTo}`}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="relative">
            <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center group-hover:from-${gradientFrom.split('-')[1]}-200 group-hover:to-${gradientTo.split('-')[1]}-300 transition-all duration-300`}>
              <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
            <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${gradientFrom.replace('100', '500')} ${gradientTo.replace('200', '500')} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
              {step}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <div className={`flex items-center justify-center gap-2 ${textColor} group-hover:${textColor.replace('600', '700')} transition-colors`}>
              <span className="text-sm font-medium">
                {step === 1 ? 'Start Building' : step === 2 ? 'Customize Design' : 'Start Sharing'}
              </span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
