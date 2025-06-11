
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useOpportunityTranslations } from "@/hooks/useOpportunityTranslations";
import { ResponsiveTitle } from "@/components/shared/ResponsiveTitle";
import { SectionCard } from "@/components/shared/SectionCard";

export const WhySupportSection = () => {
  const { t } = useOpportunityTranslations();
  
  // Access individual highlight items directly from the translation system
  const highlights = [
    {
      title: t('whySupport.highlights.0.title', 'Remote Ready'),
      subtitle: t('whySupport.highlights.0.subtitle', 'Killer Home Office')
    },
    {
      title: t('whySupport.highlights.1.title', 'Part-Time'),
      subtitle: t('whySupport.highlights.1.subtitle', 'Perfect Fit')
    },
    {
      title: t('whySupport.highlights.2.title', 'Stockholm'),
      subtitle: t('whySupport.highlights.2.subtitle', 'Local Knowledge')
    },
    {
      title: t('whySupport.highlights.3.title', 'Available Now'),
      subtitle: t('whySupport.highlights.3.subtitle', 'Ready to Start')
    }
  ];

  console.log('WhySupportSection highlights:', highlights);

  return (
    <section id="why-support" className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <SectionCard gradient="from-blue-500 via-purple-500 to-pink-500">
          <div className="text-center text-white">
            <ResponsiveTitle
              titleKey="whySupport.title"
              mobileTitleKey="whySupport.titleMobile"
              className="text-xl sm:text-2xl md:text-3xl font-bold mb-6"
            />
            <p className="text-base text-white text-center mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
              {t('whySupport.description')}
            </p>
            
            {/* Enhanced Highlight Points Grid with Better Contrast */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {highlights.map((highlight, index) => (
                <div key={index} className="group">
                  <Card className="bg-black/30 backdrop-blur-sm border border-white/50 hover:bg-black/40 transition-all duration-300 hover:scale-105 hover:rotate-2 h-24 flex items-center justify-center">
                    <CardContent className="p-2 md:p-3 text-center flex flex-col items-center justify-center h-full text-white">
                      <div className="w-8 h-8 mx-auto mb-2 bg-white/30 rounded-full flex items-center justify-center group-hover:animate-bounce">
                        {index === 0 && <span className="text-base">🏠</span>}
                        {index === 1 && <span className="text-base">⏰</span>}
                        {index === 2 && <span className="text-base">🇸🇪</span>}
                        {index === 3 && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="text-xs md:text-sm font-bold mb-0.5 whitespace-nowrap">{highlight.title}</div>
                      <div className="text-xs md:text-sm opacity-90">{highlight.subtitle}</div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  );
};
