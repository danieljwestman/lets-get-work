import React from 'react';
import { Button } from '@/components/ui/button';

interface PrintLanguageControlsProps {
  language: 'en' | 'sv';
  onLanguageChange: (lang: 'en' | 'sv') => void;
  onPrint: () => void;
  onBack: () => void;
}

export const PrintLanguageControls: React.FC<PrintLanguageControlsProps> = ({
  language,
  onLanguageChange,
  onPrint,
  onBack
}) => {
  return (
    <div className="print-no-print fixed top-4 right-4 z-50 flex gap-2">
      <div className="flex bg-white/90 backdrop-blur-sm rounded-lg p-1 border shadow-sm">
        <Button
          size="sm"
          variant={language === 'en' ? 'default' : 'ghost'}
          onClick={() => onLanguageChange('en')}
          className="text-xs px-3 py-1"
        >
          🇬🇧 EN
        </Button>
        <Button
          size="sm"
          variant={language === 'sv' ? 'default' : 'ghost'}
          onClick={() => onLanguageChange('sv')}
          className="text-xs px-3 py-1"
        >
          🇸🇪 SV
        </Button>
      </div>
      <Button
        onClick={onPrint}
        className="px-4 py-2 text-sm"
      >
        Print / Save PDF
      </Button>
      <Button
        variant="outline"
        onClick={onBack}
        className="px-4 py-2 text-sm"
      >
        Back
      </Button>
    </div>
  );
};