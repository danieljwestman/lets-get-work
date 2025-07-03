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
          padding: 20mm 18mm !important;
          background: white !important;
          color: #000 !important;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-size: 11px !important;
          line-height: 1.4 !important;
          height: 297mm !important;
          max-height: 297mm !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }
        .print-no-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .print-header {
          border-bottom: 2px solid #000;
          margin-bottom: 18px;
          padding-bottom: 12px;
        }
        .print-section {
          margin-bottom: 16px;
        }
        .print-section h2 {
          font-size: 13px !important;
          font-weight: bold !important;
          margin-bottom: 8px !important;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          border-bottom: 1px solid #333;
          padding-bottom: 4px;
          color: #000 !important;
        }
        .print-section h3 {
          font-size: 11px !important;
          font-weight: bold !important;
          margin-bottom: 4px !important;
          color: #000 !important;
        }
        .print-grid {
          display: grid;
          grid-template-columns: 38% 62%;
          gap: 20px;
          height: auto;
        }
        .print-skills-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 4px;
        }
        .print-skill-pill {
          background: #f4f4f4;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 9px;
          border: 1px solid #ddd;
          white-space: nowrap;
        }
        .print-tools-compact {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 2px;
        }
        .print-tool-item {
          font-size: 9px;
          padding: 2px 6px;
          background: #f8f8f8;
          border-radius: 6px;
          border: 0.5px solid #e0e0e0;
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
          gap: 4px 12px;
          font-size: 10px;
          line-height: 1.3;
        }
        .print-compact-exp {
          margin-bottom: 12px;
          padding-bottom: 8px;
        }
        .print-summary {
          font-size: 10px;
          line-height: 1.4;
          margin-bottom: 16px;
          text-align: justify;
        }
        .print-language-item {
          margin-bottom: 4px;
          font-size: 10px;
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