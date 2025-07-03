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
      {/* Core Skills - Colorful Pills */}
      <div className="print-section">
        <h2>🎯 {language === 'en' ? 'Core Competencies' : 'Kärnkompetenser'}</h2>
        <div className="print-skills-pills">
          {coreSkills.map((skill, index) => (
            <span key={index} className="print-skill-pill">
              {skill.emoji} {skill.text}
            </span>
          ))}
        </div>
      </div>

      {/* Technical Skills - Colorful Categories */}
      <div className="print-section">
        <h2>⚡ {language === 'en' ? 'Technical Skills' : 'Tekniska Färdigheter'}</h2>
        {essentialToolCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-3">
            <h3 className="text-xs font-bold mb-2 text-purple-700">🔧 {category.title}</h3>
            <div className="print-tools-compact">
              {category.tools.slice(0, 8).map((tool, toolIndex) => (
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
        <h2>🌍 {language === 'en' ? 'Languages' : 'Språk'}</h2>
        <div className="space-y-2">
          <div className="print-language-item">
            <span className="font-bold text-blue-700">🇸🇪 {language === 'en' ? 'Swedish' : 'Svenska'}:</span> 
            <span className="ml-2 text-green-700 font-semibold">{language === 'en' ? 'Native' : 'Modersmål'}</span>
          </div>
          <div className="print-language-item">
            <span className="font-bold text-blue-700">🇬🇧 {language === 'en' ? 'English' : 'Engelska'}:</span> 
            <span className="ml-2 text-green-700 font-semibold">{language === 'en' ? 'Fluent' : 'Flytande'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};