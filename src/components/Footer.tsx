

import { useOpportunityTranslations } from "@/hooks/useOpportunityTranslations";

export const Footer = () => {
  const { t } = useOpportunityTranslations();

  return (
    <footer className="text-center py-8 px-6 text-gray-500">
      <div className="space-y-12">
        <p className="hover:animate-pulse cursor-default text-sm md:text-base leading-relaxed">
          {t('footer.text').split('Lovable')[0]}
          <a 
            href="https://lovable.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-purple-300 hover:decoration-purple-500 transition-colors cursor-pointer"
          >
            Lovable 
          </a>
          {t('footer.text').split('Lovable')[1]}
        </p>
        
        {/* Let's Get Work Branding */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center space-y-3">
            <div className="text-sm text-gray-500 font-light text-center">
              Powered by
            </div>
            <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LetsGetWork
            </div>
            
            {/* Enhanced experimental info container */}
            <div className="w-full px-4 sm:px-0 max-w-lg mx-auto">
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-300/60 rounded-xl p-4 sm:p-5 shadow-sm backdrop-blur-sm">
                <div className="text-xs sm:text-sm text-gray-700 font-light text-center leading-relaxed">
                  {t('footer.experimental')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

