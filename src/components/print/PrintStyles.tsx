import React from 'react';

export const PrintStyles: React.FC = () => {
  return (
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
  );
};