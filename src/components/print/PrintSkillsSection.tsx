import React from 'react';
import { SkillItem } from '@/data/skillsData';

interface ToolCategory {
  title: string;
  tools: { name: string }[];
}

interface PrintSkillsSectionProps {
  coreSkills: SkillItem[];
  essentialToolCategories: ToolCategory[];
  language: 'en' | 'sv';
}

export const PrintSkillsSection: React.FC<PrintSkillsSectionProps> = ({
  coreSkills,
  essentialToolCategories,
  language
}) => {
  return (
    <div>
      {/* Core Skills - Compact Pills */}
      <div className="print-section">
        <h2>{language === 'en' ? 'Core Competencies' : 'Kärnkompetenser'}</h2>
        <div className="print-skills-pills">
          {coreSkills.map((skill, index) => (
            <span key={index} className="print-skill-pill">
              {skill.text}
            </span>
          ))}
        </div>
      </div>

      {/* Technical Skills - Ultra Compact */}
      <div className="print-section">
        <h2>{language === 'en' ? 'Technical Skills' : 'Tekniska Färdigheter'}</h2>
        {essentialToolCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-2">
            <h3 className="text-xs font-semibold mb-1">{category.title}</h3>
            <div className="print-tools-compact">
              {category.tools.slice(0, 6).map((tool, toolIndex) => (
                <span key={toolIndex} className="print-tool-item">
                  {tool.name.replace(/[🚀🎫💬🎧📈💡📋⚛️🎨🎭🐰⚡🔌💻🔄💭🤖📧💬📝🎨🍎🐙]/g, '').trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div className="print-section">
        <h2>{language === 'en' ? 'Languages' : 'Språk'}</h2>
        <div className="space-y-1">
          <div className="print-language-item"><strong>{language === 'en' ? 'Swedish' : 'Svenska'}:</strong> {language === 'en' ? 'Native' : 'Modersmål'}</div>
          <div className="print-language-item"><strong>{language === 'en' ? 'English' : 'Engelska'}:</strong> {language === 'en' ? 'Fluent' : 'Flytande'}</div>
        </div>
      </div>
    </div>
  );
};