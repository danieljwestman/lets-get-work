
import React from 'react';
import { Clock, Briefcase, Users, CheckCircle, Star } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { ResponsiveContainer } from '@/components/shared/ResponsiveContainer';
import { ResponsiveTitle } from '@/components/shared/ResponsiveTitle';
import { useOpportunityTranslations } from '@/hooks/useOpportunityTranslations';

const InquiryTypesSection = () => {
  const { t } = useOpportunityTranslations();

  const inquiryTypes = [
    {
      id: 'partTime',
      icon: Clock,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100'
    },
    {
      id: 'fullTime',
      icon: Briefcase,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'consultancy',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <Section id="inquiry-types" className="relative bg-gradient-to-br from-slate-100 via-blue-100 to-purple-200">
      <ResponsiveContainer>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ResponsiveTitle
              titleKey="inquiryTypes.titleMobile"
              mobileTitleKey="inquiryTypes.titleMobile"
              className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            />
            <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600 fill-purple-600 hidden md:inline" />
          </div>
          <p className="text-base text-gray-600 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('inquiryTypes.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {inquiryTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-rotate-1 p-6"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${type.iconBg} rounded-2xl mb-6 shadow-md`}>
                    <IconComponent className={`w-8 h-8 ${type.iconColor}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {t(`inquiryTypes.types.${type.id}.title`)}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {t(`inquiryTypes.types.${type.id}.description`)}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{t(`inquiryTypes.types.${type.id}.benefit1`)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{t(`inquiryTypes.types.${type.id}.benefit2`)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ResponsiveContainer>
    </Section>
  );
};

export default InquiryTypesSection;
