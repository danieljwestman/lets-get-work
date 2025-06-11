
import { TimelineExperience } from "@/types/timeline";

export interface ExperienceDataItem {
  id: string;
  titleKey: string;
  companyKey: string;
  periodKey: string;
  descriptionKey: string;
  emoji: string;
  order: number;
}

export const experienceData: ExperienceDataItem[] = [
  {
    id: "ai-prompt-engineer",
    titleKey: "experience.items.0.title",
    companyKey: "experience.items.0.company", 
    periodKey: "experience.items.0.period",
    descriptionKey: "experience.items.0.description",
    emoji: "🧠",
    order: 1
  },
  {
    id: "tech-entrepreneur",
    titleKey: "experience.items.1.title",
    companyKey: "experience.items.1.company",
    periodKey: "experience.items.1.period", 
    descriptionKey: "experience.items.1.description",
    emoji: "🚀",
    order: 2
  },
  {
    id: "design-advocate",
    titleKey: "experience.items.2.title",
    companyKey: "experience.items.2.company",
    periodKey: "experience.items.2.period",
    descriptionKey: "experience.items.2.description", 
    emoji: "💎",
    order: 3
  },
  {
    id: "stockholm-veteran",
    titleKey: "experience.items.3.title",
    companyKey: "experience.items.3.company",
    periodKey: "experience.items.3.period",
    descriptionKey: "experience.items.3.description",
    emoji: "🏢", 
    order: 4
  },
  {
    id: "university-explorer",
    titleKey: "experience.items.4.title",
    companyKey: "experience.items.4.company",
    periodKey: "experience.items.4.period",
    descriptionKey: "experience.items.4.description",
    emoji: "🎓",
    order: 5
  }
];

export const getExperienceData = (t: (key: string) => string): TimelineExperience[] => {
  return experienceData
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      title: t(item.titleKey) || item.titleKey,
      company: t(item.companyKey) || item.companyKey,
      period: t(item.periodKey) || item.periodKey,
      description: t(item.descriptionKey) || item.descriptionKey,
      emoji: item.emoji
    }));
};
