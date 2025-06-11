
export interface SkillItem {
  text: string;
  emoji: string;
}

export const skillsData: SkillItem[] = [
  { text: "Customer Success", emoji: "🎯" },
  { text: "Technical Support", emoji: "🛠️" },
  { text: "User Onboarding", emoji: "✨" },
  { text: "Problem Solving", emoji: "🧩" },
  { text: "Design Eye", emoji: "👁️" },
  { text: "SaaS Platforms", emoji: "🚀" },
  { text: "Home Office Pro", emoji: "🏠" },
  { text: "Stockholm Local", emoji: "🇸🇪" },
  { text: "Quality-Driven", emoji: "💎" },
  { text: "Idea Catalyst", emoji: "💡" },
  { text: "AI Prompt Engineer", emoji: "🤖" },
  { text: "Quick Learning", emoji: "⚡" }
];

// Legacy export for backward compatibility
export const skills = skillsData.map(skill => `${skill.text} ${skill.emoji}`);
