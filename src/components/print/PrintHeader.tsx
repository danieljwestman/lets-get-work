import React from 'react';

interface PrintHeaderProps {
  fullName: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  qrCodeUrl: string;
  language: 'en' | 'sv';
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  fullName,
  tagline,
  location,
  email,
  phone,
  linkedin,
  github,
  qrCodeUrl,
  language
}) => {
  return (
    <div className="print-header print-no-break">
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <h1 className="text-2xl font-bold mb-2 leading-tight">{fullName}</h1>
          <p className="text-base mb-4 text-gray-700 font-medium">{tagline}</p>
          <div className="print-contact-grid">
            <span className="font-semibold">📍</span><span>{location}</span>
            <span className="font-semibold">✉️</span><span>{email}</span>
            <span className="font-semibold">📱</span><span>{phone}</span>
            <span className="font-semibold">💼</span><span>{linkedin}</span>
            <span className="font-semibold">⚡</span><span>{github}</span>
          </div>
        </div>
        <div className="print-qr">
          <img src={qrCodeUrl} alt="Digital Portfolio" className="w-20 h-20" />
          <p className="text-xs text-center mt-2 font-medium">
            {language === 'en' ? 'Scan for portfolio' : 'Skanna för portfolio'}
          </p>
        </div>
      </div>
    </div>
  );
};