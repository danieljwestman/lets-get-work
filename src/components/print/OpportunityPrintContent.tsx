import React, { useState } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { useSimpleTranslations } from '@/hooks/useSimpleTranslations';
import { getExperienceData } from '@/data/experienceData';
import { skillsData } from '@/data/skillsData';
import { toolCategories } from '@/data/tools';
import { Button } from '@/components/ui/button';

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

  // Curated content for single-page optimization
  const coreSkills = skillsData.slice(0, 9); // Reduced from 12
  const topExperiences = experienceItems.slice(0, 3); // Reduced from 4
  const essentialToolCategories = toolCategories.slice(0, 3); // Show only top 3 categories

  return (
    <div className="print-resume">
      {/* Optimized Print Styles for Single Page */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-resume, .print-resume * {
            visibility: visible;
          }
          .print-resume {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 15mm !important;
            background: white !important;
            color: #000 !important;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-size: 10px !important;
            line-height: 1.3 !important;
            height: 297mm !important;
            overflow: hidden !important;
          }
          .print-no-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .print-header {
            border-bottom: 1.5px solid #000;
            margin-bottom: 12px;
            padding-bottom: 8px;
          }
          .print-section {
            margin-bottom: 10px;
          }
          .print-section h2 {
            font-size: 12px !important;
            font-weight: bold !important;
            margin-bottom: 5px !important;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border-bottom: 0.5px solid #666;
            padding-bottom: 2px;
            color: #000 !important;
          }
          .print-section h3 {
            font-size: 10px !important;
            font-weight: bold !important;
            margin-bottom: 2px !important;
            color: #000 !important;
          }
          .print-grid {
            display: grid;
            grid-template-columns: 35% 65%;
            gap: 12px;
            height: auto;
          }
          .print-skills-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 3px;
          }
          .print-skill-pill {
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 8px;
            border: 0.5px solid #ccc;
          }
          .print-tools-compact {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
          }
          .print-tool-item {
            font-size: 8px;
            padding: 1px 4px;
            background: #f8f8f8;
            border-radius: 4px;
          }
          .print-no-print {
            display: none !important;
          }
          .print-qr {
            flex-shrink: 0;
          }
          .print-contact-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 2px 8px;
            font-size: 9px;
          }
          .print-compact-exp {
            margin-bottom: 8px;
          }
          .print-summary {
            font-size: 9px;
            line-height: 1.2;
            margin-bottom: 10px;
          }
        }
        
        @media screen {
          .print-resume {
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm;
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 10px;
            line-height: 1.3;
            color: #000;
            min-height: 297mm;
            position: relative;
          }
        }
      `}</style>

      {/* Language & Print Controls */}
      <div className="print-no-print fixed top-4 right-4 z-50 flex gap-2">
        <div className="flex bg-white/90 backdrop-blur-sm rounded-lg p-1 border shadow-sm">
          <Button
            size="sm"
            variant={language === 'en' ? 'default' : 'ghost'}
            onClick={() => setLanguage('en')}
            className="text-xs px-3 py-1"
          >
            🇬🇧 EN
          </Button>
          <Button
            size="sm"
            variant={language === 'sv' ? 'default' : 'ghost'}
            onClick={() => setLanguage('sv')}
            className="text-xs px-3 py-1"
          >
            🇸🇪 SV
          </Button>
        </div>
        <Button
          onClick={handlePrint}
          className="px-4 py-2 text-sm"
        >
          Print / Save PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm"
        >
          Back
        </Button>
      </div>

      {/* Optimized Header */}
      <div className="print-header print-no-break">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-3">
            <h1 className="text-xl font-bold mb-1 leading-tight">{fullName}</h1>
            <p className="text-sm mb-2 text-gray-700 font-medium">{tagline}</p>
            <div className="print-contact-grid text-xs">
              <span className="font-semibold">📍</span><span>{location}</span>
              <span className="font-semibold">✉️</span><span>{email}</span>
              <span className="font-semibold">📱</span><span>{phone}</span>
              <span className="font-semibold">💼</span><span>{linkedin}</span>
              <span className="font-semibold">⚡</span><span>{github}</span>
            </div>
          </div>
          <div className="print-qr">
            <img src={qrCodeUrl} alt="Digital Portfolio" className="w-16 h-16" />
            <p className="text-xs text-center mt-1 font-medium">
              {language === 'en' ? 'Scan for portfolio' : 'Skanna för portfolio'}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="print-section print-no-break">
        <h2>{language === 'en' ? 'Professional Summary' : 'Professionell Sammanfattning'}</h2>
        <p className="print-summary">
          {language === 'en' 
            ? 'Stockholm-based Full-Stack Developer & Customer Success Expert with 10+ years experience building user-centric platforms. Combines technical expertise in React, AI integration, and platform development with deep customer understanding. Remote-ready professional with passion for quality and innovation.'
            : 'Stockholm-baserad Full-Stack Utvecklare & Customer Success Expert med 10+ års erfarenhet av att bygga användarcentrerade plattformar. Kombinerar teknisk expertis inom React, AI-integration och plattformsutveckling med djup kundförståelse. Distansarbete-redo med passion för kvalitet och innovation.'
          }
        </p>
      </div>

      {/* Optimized Two-Column Layout */}
      <div className="print-grid">
        {/* Left Column (35%) */}
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
            <div className="text-xs space-y-1">
              <div><strong>{language === 'en' ? 'Swedish' : 'Svenska'}:</strong> {language === 'en' ? 'Native' : 'Modersmål'}</div>
              <div><strong>{language === 'en' ? 'English' : 'Engelska'}:</strong> {language === 'en' ? 'Fluent' : 'Flytande'}</div>
            </div>
          </div>
        </div>

        {/* Right Column (65%) */}
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
      </div>
    </div>
  );
};