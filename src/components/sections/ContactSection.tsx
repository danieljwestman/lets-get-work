import { Mail, Github, Linkedin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCompany } from "@/contexts/OpportunityContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ResponsiveTitle } from "@/components/shared/ResponsiveTitle";
import { Section } from "@/components/shared/Section";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { ContactEmailModal } from "@/components/contact/ContactEmailModal";

interface ContactSectionProps {
  onOpenChat?: () => void;
}

export const ContactSection = ({ onOpenChat }: ContactSectionProps) => {
  const { t } = useLanguage();
  const { company } = useCompany();
  const { trackChatStart, trackExternalLink } = useAnalytics();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleEmailClick = () => {
    setIsEmailModalOpen(true);
  };

  const handleChatClick = () => {
    console.log('ContactSection: Chat button clicked');
    if (onOpenChat) {
      console.log('ContactSection: Calling trackChatStart and onOpenChat');
      trackChatStart('contact');
      onOpenChat();
    } else {
      console.log('ContactSection: onOpenChat not available');
    }
  };

  const handleGithubClick = () => {
    trackExternalLink('github', 'contact_section');
    window.open('https://github.com/danieljwestman', '_blank');
  };

  const handleLinkedinClick = () => {
    trackExternalLink('linkedin', 'contact_section');
    window.open('https://www.linkedin.com/in/daniel-westman-1224a6b/', '_blank');
  };

  // Show DaniBot for all companies including default
  const showDaniBot = onOpenChat;

  return (
    <Section id="contact" size="small">
      <div className="text-center">
        <ResponsiveTitle
          titleKey="contact.title"
          mobileTitleKey="contact.titleMobile"
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        />
        <p className="text-base text-gray-600 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
          {t('contact.description')}
        </p>
        
        {/* Updated responsive button layout - stack on mobile/tablet, row on larger screens */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 justify-center max-w-2xl mx-auto">
          <AnimatedButton
            onClick={handleEmailClick}
            gradient="primary"
            animation="hoverRotate"
            icon={Mail}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base w-full lg:w-auto"
          >
            {t('contact.buttons.email')}
          </AnimatedButton>

          {/* DaniBot button - show for all companies */}
          {showDaniBot && (
            <AnimatedButton
              onClick={handleChatClick}
              variant="outline"
              animation="hoverRotate"
              icon={MessageCircle}
              className="border-2 border-green-300 text-green-600 hover:bg-green-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base w-full lg:w-auto"
            >
              {t('hero.buttons.chatWithDaniBot', 'Chat with DaniBot')}
            </AnimatedButton>
          )}
          
          <AnimatedButton
            onClick={handleGithubClick}
            variant="outline"
            animation="hoverRotateNeg"
            icon={Github}
            className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base w-full lg:w-auto"
          >
            {t('contact.buttons.github')}
          </AnimatedButton>
          
          <AnimatedButton
            onClick={handleLinkedinClick}
            variant="outline"
            animation="hoverRotate"
            icon={Linkedin}
            className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base w-full lg:w-auto"
          >
            {t('contact.buttons.linkedin')}
          </AnimatedButton>
        </div>
      </div>

      <ContactEmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
      />
    </Section>
  );
};
