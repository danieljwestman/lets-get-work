
import { useOpportunityTranslations } from "@/hooks/useOpportunityTranslations";
import { ResponsiveTitle } from "@/components/shared/ResponsiveTitle";
import { JourneyTimeline } from "@/components/shared/JourneyTimeline";
import { Section } from "@/components/shared/Section";
import { getExperienceData } from "@/data/experienceData";

export const ExperienceSection = () => {
  const { t } = useOpportunityTranslations();
  
  // Get structured experience data with translations
  const experiences = getExperienceData(t);

  return (
    <Section id="experience" background="gradient">
      <ResponsiveTitle
        titleKey="experience.title"
        mobileTitleKey="experience.titleMobile"
        className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
      />
      <p className="text-base text-gray-600 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
        {t('experience.description')}
      </p>
      <JourneyTimeline experiences={experiences} />
    </Section>
  );
};
