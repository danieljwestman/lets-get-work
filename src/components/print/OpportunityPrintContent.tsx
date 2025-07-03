import React from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { useSimpleTranslations } from '@/hooks/useSimpleTranslations';
import { getExperienceData } from '@/data/experienceData';
import { skillsData } from '@/data/skillsData';
import { toolCategories } from '@/data/tools';
import { QrCode } from 'lucide-react';

interface OpportunityPrintContentProps {
  opportunity: OpportunityWithTheme;
}

export const OpportunityPrintContent: React.FC<OpportunityPrintContentProps> = ({ opportunity }) => {
  const { t } = useSimpleTranslations(opportunity.theme.theme_id, 'en');
  const experienceItems = getExperienceData(t);

  // Get contact information from translations
  const fullName = t('hero.name') || 'Daniel Wikander';
  const tagline = t('hero.tagline') || 'Full-Stack Developer & Customer Success Expert';
  const location = 'Stockholm, Sweden';
  const email = 'daniel@example.com'; // This should come from profile data
  const phone = '+46 70 123 45 67'; // This should come from profile data
  const linkedin = 'linkedin.com/in/danielwikander';
  const github = 'github.com/danielwikander';

  // Create QR code URL for the full presentation
  const presentationUrl = `${window.location.origin}/opportunities/${opportunity.profile_id}/${opportunity.opportunity_id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(presentationUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-resume">
      {/* Print styles */}
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
            padding: 20px !important;
            background: white !important;
            color: black !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
          }
          .print-no-break {
            page-break-inside: avoid;
          }
          .print-header {
            border-bottom: 2px solid #000;
            margin-bottom: 20px;
            padding-bottom: 15px;
          }
          .print-section {
            margin-bottom: 15px;
          }
          .print-section h2 {
            font-size: 14px !important;
            font-weight: bold !important;
            margin-bottom: 8px !important;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
          }
          .print-section h3 {
            font-size: 12px !important;
            font-weight: bold !important;
            margin-bottom: 4px !important;
          }
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .print-skills-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
          }
          .print-tools-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 3px;
          }
          .print-no-print {
            display: none !important;
          }
          .print-qr {
            float: right;
            margin-left: 10px;
          }
        }
        
        @media screen {
          .print-resume {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #000;
          }
        }
      `}</style>

      {/* Print/Preview Controls */}
      <div className="print-no-print fixed top-4 right-4 z-50 space-x-2">
        <button
          onClick={handlePrint}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
        >
          Back to Presentation
        </button>
      </div>

      {/* Header Section */}
      <div className="print-header print-no-break">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{fullName}</h1>
            <p className="text-lg mb-3 text-gray-700">{tagline}</p>
            <div className="space-y-1 text-sm">
              <p><strong>Location:</strong> {location}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Phone:</strong> {phone}</p>
              <p><strong>LinkedIn:</strong> {linkedin}</p>
              <p><strong>GitHub:</strong> {github}</p>
            </div>
          </div>
          <div className="print-qr">
            <img src={qrCodeUrl} alt="QR Code to Digital Resume" className="w-20 h-20" />
            <p className="text-xs text-center mt-1">Scan for full presentation</p>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="print-section print-no-break">
        <h2>Professional Summary</h2>
        <p className="text-sm">
          Stockholm-based Full-Stack Developer and Customer Success Expert with 10+ years of experience 
          building user-centric platforms and delivering exceptional support experiences. Combines technical 
          expertise in React, AI integration, and platform development with deep understanding of customer 
          needs and business objectives. Remote-ready professional with a passion for quality and innovation.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="print-grid">
        {/* Left Column */}
        <div>
          {/* Core Skills */}
          <div className="print-section">
            <h2>Core Competencies</h2>
            <div className="print-skills-grid">
              {skillsData.slice(0, 12).map((skill, index) => (
                <div key={index} className="text-xs py-1">
                  • {skill.text}
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="print-section">
            <h2>Technical Skills</h2>
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-3">
                <h3>{category.title}</h3>
                <div className="print-tools-grid">
                  {category.tools.slice(0, 8).map((tool, toolIndex) => (
                    <div key={toolIndex} className="text-xs py-1">
                      {tool.name.replace(/[🚀🎫💬🎧📈💡📋⚛️🎨🎭🐰⚡🔌💻🔄💭🤖📧💬📝🎨🍎🐙]/g, '').trim()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Professional Experience */}
          <div className="print-section">
            <h2>Professional Experience</h2>
            {experienceItems.slice(0, 4).map((experience, index) => (
              <div key={index} className="mb-4 print-no-break">
                <h3>{experience.title}</h3>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {experience.company} | {experience.period}
                </p>
                <p className="text-xs">{experience.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="print-section">
            <h2>Personal Touch</h2>
            <p className="text-xs">
              Family man with two kids who loves building things - both software platforms and 
              carpentry projects. Stockholm local with global perspective, combining Scandinavian 
              work-life balance with entrepreneurial drive.
            </p>
            <p className="text-xs mt-2">
              <strong>References:</strong> Available upon request
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="print-section mt-6 pt-4 border-t border-gray-300 text-xs text-center text-gray-600">
        <p>This resume is generated from a dynamic presentation platform.</p>
        <p>Scan the QR code above or visit: {presentationUrl}</p>
      </div>
    </div>
  );
};