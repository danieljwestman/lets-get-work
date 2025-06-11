
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex bg-white/20 backdrop-blur-sm rounded-full p-1 border border-white/30 min-h-[40px] sm:min-h-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 sm:px-3 sm:py-1 text-sm sm:text-xs rounded-full transition-all duration-200 min-h-[32px] sm:min-h-auto ${
          language === 'en' 
            ? 'bg-white text-purple-600 shadow' 
            : 'text-gray-800 hover:text-gray-900 hover:bg-white/10'
        }`}
      >
        🇬🇧 EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('sv')}
        className={`px-4 py-2 sm:px-3 sm:py-1 text-sm sm:text-xs rounded-full transition-all duration-200 min-h-[32px] sm:min-h-auto ${
          language === 'sv' 
            ? 'bg-white text-purple-600 shadow' 
            : 'text-gray-800 hover:text-gray-900 hover:bg-white/10'
        }`}
      >
        🇸🇪 SV
      </Button>
    </div>
  );
};
