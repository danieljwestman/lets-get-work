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
      {/* Professional Experience - Top 3 Only */}
      <div className="print-section">
        <h2>{language === 'en' ? 'Professional Experience' : 'Yrkeslivserfarenhet'}</h2>
        {topExperiences.map((experience, index) => (
          <div key={index} className="print-compact-exp print-no-break">
            <h3 className="font-bold text-xs">{experience.title}</h3>
            <p className="text-xs font-medium text-gray-600 mb-1">
              {experience.company} | {experience.period}
            </p>
            <p className="text-xs leading-tight">{experience.description}</p>
          </div>
        ))}
      </div>

      {/* Personal Touch - Condensed */}
      <div className="print-section">
        <h2>{language === 'en' ? 'Personal Profile' : 'Personlig Profil'}</h2>
        <p className="text-xs leading-tight">
          {language === 'en' 
            ? 'Family man with two kids who loves building things - both software platforms and carpentry projects. Stockholm local with global perspective, combining Scandinavian work-life balance with entrepreneurial drive.'
            : 'Familjepappa med två barn som älskar att bygga saker - både mjukvaruplattformar och snickprojekt. Stockholmare med globalt perspektiv, kombinerar skandinavisk work-life balance med entreprenörsdrift.'
          }
        </p>
      </div>
    </div>
  );
};