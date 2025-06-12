
import { useOpportunityTranslations } from "@/hooks/useOpportunityTranslations";

export const Footer = () => {
  const { t } = useOpportunityTranslations();

  return (
    <footer className="relative">
      {/* Top separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12" />
      
      {/* Unified footer container */}
      <div className="text-center pb-12 px-6">
        <div className="mx-auto max-w-3xl">
          {/* Main unified card container */}
          <div className="relative">
            {/* Background with gradient and glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white/60 to-gray-50/80 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200/50" />
            
            {/* Content container */}
            <div className="relative p-8 sm:p-10 space-y-8">
              
              {/* Crafted with care section */}
              <div className="space-y-2">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
                  {t('footer.text').split('Lovable')[0]}
                  <a 
                    href="https://lovable.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold underline decoration-purple-300 hover:decoration-purple-500 transition-all duration-300 hover:scale-105"
                  >
                    Lovable 
                  </a>
                  {t('footer.text').split('Lovable')[1]}
                </p>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300" />
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300" />
              </div>

              {/* Powered by section with enhanced styling */}
              <div className="space-y-4">
                <div className="text-xs text-gray-500 font-light tracking-wide uppercase">
                  Powered by
                </div>
                
                {/* LetsGetWork logo with enhanced styling */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-xl" />
                  <div className="relative text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent tracking-tight">
                    LetsGetWork
                  </div>
                </div>
              </div>

              {/* Another decorative divider */}
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                <div className="w-1 h-1 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-300" />
              </div>

              {/* Experimental showcase description */}
              <div className="space-y-1">
                <div className="inline-block">
                  <div className="bg-gradient-to-br from-gray-100/80 to-gray-50/60 border border-gray-200/60 rounded-xl px-6 py-4 shadow-sm backdrop-blur-sm">
                    <div className="text-xs sm:text-sm text-gray-700 font-light leading-relaxed">
                      {t('footer.experimental')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-2xl blur-xl opacity-50 -z-10" />
          </div>
        </div>
      </div>
    </footer>
  );
};
