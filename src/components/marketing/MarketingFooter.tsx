
import { Card, CardContent } from "@/components/ui/card";

export const MarketingFooter = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Main footer container with reduced top padding */}
      <div className="text-center pb-12 sm:pb-20 pt-8 sm:pt-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Main unified card container using consistent card styling */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="py-12 sm:py-16 md:py-12 lg:py-10 px-6 sm:px-10 md:px-12 lg:px-10 space-y-10 sm:space-y-12 md:space-y-8 lg:space-y-6">
              
              {/* Crafted with care section */}
              <div className="space-y-4">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
                  Crafted with ❤️ and powered by{' '}
                  <a 
                    href="https://lovable.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold relative group"
                  >
                    <span className="relative z-10">Lovable</span>
                    <div className="absolute inset-0 bg-purple-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
                  </a>
                  {' '}- where great ideas become reality! ✨
                </p>
              </div>

              {/* Powered by section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="text-xs text-gray-500 font-light tracking-wider uppercase">
                  Powered by
                </div>
                
                {/* LetsGetWork logo - now clickable */}
                <div className="relative inline-block">
                  <a href="/marketing" className="block">
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
                  </a>
                </div>
              </div>

              {/* Marketing-specific description */}
              <div className="text-sm sm:text-base text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
                This is a showcase application demonstrating the power of modern web development. 
                LetsGetWork represents the future of digital career presentations - where technology meets opportunity.
              </div>

              {/* Personal attribution with improved styling */}
              <div className="text-sm text-gray-600 font-light">
                <a 
                  href="/" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-blue-50/50 hover:scale-105 hover:shadow-sm"
                >
                  <span className="relative z-10">Made by Daniel - check out his page</span>
                  <div className="absolute inset-0 bg-blue-100/50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom ambient lighting */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-blue-50/30 via-purple-50/20 to-transparent blur-3xl -z-20" />
    </footer>
  );
};
