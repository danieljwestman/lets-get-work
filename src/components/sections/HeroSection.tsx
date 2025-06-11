
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Coffee, Bot } from "lucide-react";
import { FloatingBubbles } from "@/components/shared/FloatingBubbles";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCompany } from "@/contexts/OpportunityContext";
import { useDesignTokens } from "@/hooks/useDesignTokens";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeroSectionProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenChat: () => void;
}

export const HeroSection = ({ onScrollToSection, onOpenChat }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const { company } = useCompany();
  const tokens = useDesignTokens();
  const { trackChatStart, trackExternalLink } = useAnalytics();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleContactClick = useCallback(() => {
    onScrollToSection('contact');
  }, [onScrollToSection]);

  const handleAboutClick = useCallback(() => {
    onScrollToSection('about');
  }, [onScrollToSection]);

  const handleChatClick = useCallback(() => {
    console.log('HeroSection: Chat button clicked');
    trackChatStart('hero');
    console.log('HeroSection: About to call onOpenChat');
    onOpenChat();
  }, [onOpenChat, trackChatStart]);

  const handleGithubClick = useCallback(() => {
    trackExternalLink('github', 'hero_section');
    window.open('https://github.com/danieljwestman', '_blank');
  }, [trackExternalLink]);

  const handleLinkedinClick = useCallback(() => {
    trackExternalLink('linkedin', 'hero_section');
    window.open('https://www.linkedin.com/in/daniel-westman-1224a6b/', '_blank');
  }, [trackExternalLink]);

  // Always show CTAs for default resume, check company config for others
  const showCTAs = company.id === 'default' || company.content.showHeroCTAs !== false;
  const isDefaultResume = company.id === 'default';
  
  // Show DaniBot for all companies including default
  const chatButtonTranslation = t('hero.buttons.chatWithDaniBot');
  const showDaniBot = true; // Always show DaniBot

  return (
    <section className="relative overflow-hidden px-6 py-10 md:py-12">
      {/* Inline styles for avatar animation to ensure it works */}
      <style>{`
        @keyframes avatarFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-8px) translateX(4px);
          }
          50% {
            transform: translateY(-4px) translateX(-6px);
          }
          75% {
            transform: translateY(-12px) translateX(2px);
          }
        }
        .avatar-floating {
          animation: avatarFloat 6s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto max-w-4xl text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Updated title with slightly more mobile spacing */}
          <h1 className={`${tokens.typography.title.mobile} lg:${tokens.typography.title.desktop.replace('text-', '')} font-bold bg-gradient-to-r ${tokens.gradients.primary} bg-clip-text text-transparent mb-10 md:mb-16 animate-pulse leading-tight mt-16 md:mt-20`}>
            {t('hero.title')} <span className="hidden md:inline">✨</span>
          </h1>

          {/* Avatar with slightly more mobile spacing */}
          <div className="flex justify-center mb-5 md:mb-6">
            <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-gradient-to-r from-blue-200 to-purple-200 shadow-xl avatar-floating">
              <AvatarImage 
                src="/lovable-uploads/adf9ba16-d4eb-43b3-9f3f-ac2e9e61d530.png" 
                alt="Daniel Westman's Avatar" 
                className="object-cover"
              />
              <AvatarFallback className={`bg-gradient-to-r ${tokens.gradients.primary} text-white text-xl font-bold`}>
                D
              </AvatarFallback>
            </Avatar>
          </div>
          
          <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-5 md:mb-6">{t('hero.greeting')}</p>
          <p className="text-base md:text-lg text-gray-700 mb-10 md:mb-12 max-w-2xl mx-auto whitespace-pre-line">
            {t('hero.description')}
          </p>
          
          {/* Always show CTA Buttons for default resume */}
          {showCTAs && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto mb-8">
              {/* For default resume, use the same styling as Lovable version */}
              {isDefaultResume ? (
                <>
                  <Button 
                    onClick={handleChatClick}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 sm:px-6 py-3 rounded-full transition-all duration-300 hover:scale-110 text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Bot className="w-4 h-4" />
                    {chatButtonTranslation}
                  </Button>
                  
                  <Button 
                    onClick={handleContactClick}
                    variant="outline" 
                    className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-4 sm:px-6 py-3 rounded-full transition-all duration-300 hover:scale-110 hover:-rotate-2 text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Coffee className="w-4 h-4" />
                    Connect with me
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleAboutClick}
                    className={`bg-gradient-to-r ${tokens.gradients.primary} hover:scale-110 hover:rotate-2 text-white px-4 sm:px-6 py-3 rounded-full transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto`}
                  >
                    <Star className="w-4 h-4" />
                    {t('hero.buttons.getToKnow')}
                  </Button>
                  
                  {showDaniBot && (
                    <Button 
                      onClick={handleChatClick}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 sm:px-6 py-3 rounded-full transition-all duration-300 hover:scale-110 text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Bot className="w-4 h-4" />
                      {chatButtonTranslation}
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleContactClick}
                    variant="outline" 
                    className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-4 sm:px-6 py-3 rounded-full transition-all duration-300 hover:scale-110 hover:-rotate-2 text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Coffee className="w-4 h-4" />
                    {t('hero.buttons.letsTalk')}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Floating Bubbles with Smooth Floating Animations */}
      <FloatingBubbles />
    </section>
  );
};
