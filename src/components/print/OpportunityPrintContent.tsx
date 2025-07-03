import React, { useState } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { useSimpleTranslations } from '@/hooks/useSimpleTranslations';
import { getExperienceData } from '@/data/experienceData';
import { skillsData } from '@/data/skillsData';
import { toolCategories } from '@/data/tools';
import { PrintStyles } from './PrintStyles';
import { PrintHeader } from './PrintHeader';
import { PrintSkillsSection } from './PrintSkillsSection';
import { PrintExperienceSection } from './PrintExperienceSection';
import { PrintLanguageControls } from './PrintLanguageControls';

interface OpportunityPrintContentProps {
  opportunity: OpportunityWithTheme;
}

export const OpportunityPrintContent: React.FC<OpportunityPrintContentProps> = ({ opportunity }) => {
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  const { t } = useSimpleTranslations(opportunity.theme.theme_id, language);
  const experienceItems = getExperienceData(t);

  // Get contact information from translations
  const fullName = t('hero.name') || 'Daniel Wikander';
  const tagline = t('hero.tagline') || 'Full-Stack Developer & Customer Success Expert';
  const location = 'Stockholm, Sweden';
  const email = 'daniel@wikander.me';
  const phone = '+46 70 123 45 67';
  const linkedin = 'linkedin.com/in/danielwikander';
  const github = 'github.com/danielwikander';

  // Create QR code URL for the full presentation with current language
  const presentationUrl = `${window.location.origin}/opportunities/${opportunity.profile_id}/${opportunity.opportunity_id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(presentationUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  // Optimized content for enhanced single-page layout
  const coreSkills = skillsData.slice(0, 12); // Show all core skills
  const topExperiences = experienceItems; // Show all experience items
  const essentialToolCategories = toolCategories.slice(0, 4); // Show top 4 categories

  return (
    <div className="print-resume">
      <PrintStyles />

      <PrintLanguageControls
        language={language}
        onLanguageChange={setLanguage}
        onPrint={handlePrint}
        onBack={() => window.history.back()}
      />

      <PrintHeader
        fullName={fullName}
        tagline={tagline}
        location={location}
        email={email}
        phone={phone}
        linkedin={linkedin}
        github={github}
        qrCodeUrl={qrCodeUrl}
        language={language}
      />

      {/* Professional Summary */}
      <div className="print-section print-no-break">
        <h2>🎯 {language === 'en' ? 'Professional Summary' : 'Professionell Sammanfattning'}</h2>
        <p className="print-summary">
          {language === 'en' 
            ? '🚀 Stockholm-based Full-Stack Developer & Customer Success Expert with 10+ years experience building user-centric platforms. 💡 Combines technical expertise in React, AI integration, and platform development with deep customer understanding. 🌍 Remote-ready professional with passion for quality and innovation. 🎨 Proven track record of transforming complex requirements into elegant, scalable solutions.'
            : '🚀 Stockholm-baserad Full-Stack Utvecklare & Customer Success Expert med 10+ års erfarenhet av att bygga användarcentrerade plattformar. 💡 Kombinerar teknisk expertis inom React, AI-integration och plattformsutveckling med djup kundförståelse. 🌍 Distansarbete-redo med passion för kvalitet och innovation. 🎨 Bevisad förmåga att transformera komplexa krav till eleganta, skalbara lösningar.'
          }
        </p>
      </div>

      {/* Optimized Two-Column Layout */}
      <div className="print-grid">
        {/* Left Column (35%) */}
        <PrintSkillsSection
          coreSkills={coreSkills}
          essentialToolCategories={essentialToolCategories}
          language={language}
        />

        {/* Right Column (65%) */}
        <PrintExperienceSection
          topExperiences={topExperiences}
          language={language}
        />
      </div>
    </div>
  );
};