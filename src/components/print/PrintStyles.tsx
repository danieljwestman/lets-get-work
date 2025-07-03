import React from 'react';

export const PrintStyles: React.FC = () => {
  return (
    <style>{`
      @page {
        size: A4;
        margin: 15mm;
      }
      
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
          font-size: 11px !important;
          line-height: 1.5 !important;
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
          box-sizing: border-box !important;
          page-break-after: avoid !important;
        }
        .print-no-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .print-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px solid #3b82f6;
          border-radius: 12px;
          margin-bottom: 20px;
          padding: 20px;
          position: relative;
        }
        .print-hero-name {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 28px !important;
          font-weight: 900 !important;
          letter-spacing: -0.5px;
        }
        .print-section {
          margin-bottom: 16px;
        }
        .print-section h2 {
          font-size: 14px !important;
          font-weight: bold !important;
          margin-bottom: 12px !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white !important;
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
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
          background: linear-gradient(135deg, #e0f2fe, #b3e5fc);
          color: #0277bd;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 600;
          border: 2px solid #29b6f6;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .print-tools-compact {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 2px;
        }
        .print-tool-item {
          font-size: 9px;
          padding: 4px 8px;
          background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
          color: #7c3aed;
          border-radius: 8px;
          border: 1px solid #a855f7;
          font-weight: 500;
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
          margin-bottom: 14px;
          padding: 12px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border-left: 4px solid #22c55e;
          border-radius: 0 8px 8px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .print-summary {
          font-size: 11px;
          line-height: 1.6;
          margin-bottom: 20px;
          text-align: justify;
          background: linear-gradient(135deg, #fef7cd, #fef3c7);
          padding: 16px;
          border-radius: 12px;
          border: 2px solid #f59e0b;
          color: #92400e;
          font-weight: 500;
        }
        .print-language-item {
          margin-bottom: 4px;
          font-size: 10px;
        }
      }
      
      @media screen {
        .print-resume {
          max-width: 210mm;
          margin: 20px auto;
          padding: 20mm;
          background: white;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          line-height: 1.5;
          color: #000;
          height: auto;
          position: relative;
          border-radius: 8px;
        }
      }
    `}</style>
  );
};