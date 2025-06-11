
import { TrendingUp } from "lucide-react";
import { toolCategories } from "@/data/tools";
import { ToolCategory } from "@/components/shared/ToolCategory";
import { ResponsiveTitle } from "@/components/shared/ResponsiveTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section } from "@/components/shared/Section";
import { GradientText } from "@/components/shared/GradientText";

export const ToolsSection = () => {
  const { t } = useLanguage();

  return (
    <Section id="tools" background="muted" containerSize="large">
      <ResponsiveTitle
        titleKey="tools.title"
        mobileTitleKey="tools.title"
        className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
      />
      <p className="text-base text-gray-600 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
        {t('tools.description')}
      </p>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {toolCategories.map((category, index) => (
          <ToolCategory key={index} category={category} />
        ))}
      </div>
      
      {/* Bottom highlight */}
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 font-medium">
          <GradientText 
            gradient="secondary" 
            className="flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5 text-purple-600" />
            {t('tools.footer')}
          </GradientText>
        </p>
      </div>
    </Section>
  );
};
