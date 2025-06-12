
import { useOpportunityTranslations } from "@/hooks/useOpportunityTranslations";

export const Footer = () => {
  const { t } = useOpportunityTranslations();

  return (
    <footer className="relative overflow-hidden">
      {/* Main footer container with increased top and bottom padding */}
      <div className="text-center pb-12 sm:pb-20 pt-16 sm:pt-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Main unified card container */}
          <div className="relative">
            {/* Enhanced background with multiple layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-gray-50/70 to-white/90 rounded-3xl shadow-2xl backdrop-blur-md border border-white/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/30 to-pink-50/30 rounded-3xl" />
            
            {/* Content container with responsive padding - reduced on desktop */}
            <div className="relative py-12 sm:py-16 md:py-12 lg:py-10 px-6 sm:px-10 md:px-12 lg:px-10 space-y-10 sm:space-y-12 md:space-y-8 lg:space-y-6">
              
              {/* Crafted with care section */}
              <div className="space-y-4">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
                  {t('footer.text').split('Lovable')[0]}
                  <a 
                    href="https://lovable.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold relative group"
                  >
                    <span className="relative z-10">Lovable</span>
                    <div className="absolute inset-0 bg-purple-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
                  </a>
                  {t('footer.text').split('Lovable')[1]}
                </p>
              </div>

              {/* Powered by section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="text-xs text-gray-500 font-light tracking-wider uppercase">
                  Powered by
                </div>
                
                {/* LetsGetWork logo */}
                <div className="relative inline-block">
                  {/* Multiple glow layers for depth */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-3xl scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-2xl scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-xl" />
                  
                  {/* Main logo text */}
                  <div className="relative">
                    <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent tracking-tight leading-none">
                      LetsGetWork
                    </div>
                    
                    {/* Subtle reflection effect */}
                    <div className="absolute inset-0 text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-700/20 bg-clip-text text-transparent tracking-tight leading-none transform translate-y-1 blur-sm -z-10">
                      LetsGetWork
                    </div>
                  </div>
                </div>
              </div>

              {/* Experimental showcase description */}
              <div className="text-sm sm:text-base text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
                {t('footer.experimental')}
              </div>
            </div>

            {/* Enhanced outer glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl opacity-60 -z-10" />
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-40 -z-10" />
          </div>
        </div>
      </div>

      {/* Bottom ambient lighting */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-blue-50/30 via-purple-50/20 to-transparent blur-3xl -z-20" />
    </footer>
  );
};
