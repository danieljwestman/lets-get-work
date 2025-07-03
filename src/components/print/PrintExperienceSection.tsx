import React from 'react';
import { TimelineExperience } from '@/types/timeline';

interface PrintExperienceSectionProps {
  topExperiences: TimelineExperience[];
  language: 'en' | 'sv';
}

export const PrintExperienceSection: React.FC<PrintExperienceSectionProps> = ({
  topExperiences,
  language
}) => {
  return (
    <div>
      {/* Professional Experience - All Items */}
      <div className="print-section">
        <h2>💼 {language === 'en' ? 'Professional Experience' : 'Yrkeslivserfarenhet'}</h2>
        {topExperiences.map((experience, index) => (
          <div key={index} className="print-compact-exp print-no-break">
            <h3 className="font-bold text-xs text-green-800 flex items-center gap-2">
              {experience.emoji} {experience.title}
            </h3>
            <p className="text-xs font-semibold text-blue-700 mb-2">
              🏢 {experience.company} | 📅 {experience.period}
            </p>
            <p className="text-xs leading-relaxed text-gray-800">{experience.description}</p>
          </div>
        ))}
      </div>

      {/* Personal Touch - Enhanced */}
      <div className="print-section">
        <h2>🌟 {language === 'en' ? 'Personal Profile' : 'Personlig Profil'}</h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-xs leading-relaxed font-medium text-gray-800">
            {language === 'en' 
              ? '👨‍👩‍👧‍👦 Family man with two kids who loves building things - both software platforms and carpentry projects. 🏙️ Stockholm local with global perspective, combining Scandinavian work-life balance with entrepreneurial drive. 🚀 Passionate about creating user-friendly solutions that make a real difference.'
              : '👨‍👩‍👧‍👦 Familjepappa med två barn som älskar att bygga saker - både mjukvaruplattformar och snickprojekt. 🏙️ Stockholmare med globalt perspektiv, kombinerar skandinavisk work-life balance med entreprenörsdrift. 🚀 Passionerad för att skapa användarvänliga lösningar som gör verklig skillnad.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};