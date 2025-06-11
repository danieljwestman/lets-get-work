
import { useOpportunityTranslations } from "@/hooks/useOpportunityTranslations";
import { SkillBadge } from "@/components/shared/SkillBadge";
import { skills } from "@/data/skills";
import { ResponsiveTitle } from "@/components/shared/ResponsiveTitle";
import { Section } from "@/components/shared/Section";

export const SkillsSection = () => {
  const { t } = useOpportunityTranslations();

  return (
    <Section id="skills">
      <div className="text-center">
        <ResponsiveTitle
          titleKey="skills.title"
          mobileTitleKey="skills.titleMobile"
          className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        />
        <p className="text-base text-gray-600 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('skills.description')}
        </p>
        
        {/* Mobile-first responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {skills.map((skill, index) => (
            <SkillBadge key={index} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
};
