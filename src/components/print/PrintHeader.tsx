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
        <div className="flex-1 mr-6">
          <h1 className="print-hero-name mb-3 leading-none">{fullName}</h1>
          <p className="text-lg mb-6 font-semibold" style={{ color: '#1e40af' }}>{tagline}</p>
          <div className="print-contact-grid">
            <span className="font-bold text-blue-600">📍</span><span className="font-medium">{location}</span>
            <span className="font-bold text-green-600">✉️</span><span className="font-medium">{email}</span>
            <span className="font-bold text-purple-600">📱</span><span className="font-medium">{phone}</span>
            <span className="font-bold text-orange-600">💼</span><span className="font-medium">{linkedin}</span>
            <span className="font-bold text-red-600">⚡</span><span className="font-medium">{github}</span>
          </div>
        </div>
        <div className="print-qr">
          <div className="bg-white p-3 rounded-xl border-2 border-blue-300 shadow-md">
            <img src={qrCodeUrl} alt="Digital Portfolio" className="w-24 h-24 rounded-lg" />
          </div>
          <p className="text-xs text-center mt-3 font-bold text-blue-700">
            {language === 'en' ? '🔗 Scan for portfolio' : '🔗 Skanna för portfolio'}
          </p>
        </div>
      </div>
    </div>
  );
};