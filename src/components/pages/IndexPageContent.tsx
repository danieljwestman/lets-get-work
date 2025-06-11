
import React, { useRef } from 'react';
import { UserTopBar } from '@/components/shared/UserTopBar';
import { OpportunityHeader } from '@/components/shared/OpportunityHeader';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ToolsSection } from '@/components/sections/ToolsSection';
import InquiryTypesSection from '@/components/sections/InquiryTypesSection';
import { WhySupportSection } from '@/components/sections/WhySupportSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/Footer';
import { CareerChatAssistant, CareerChatAssistantRef } from '@/components/chat/CareerChatAssistant';
import { ContactEmailModal } from '@/components/contact/ContactEmailModal';
import { useIndexEventHandlers } from '@/hooks/useIndexEventHandlers';
import { OpportunityWithTheme } from '@/types/opportunity';

interface IndexPageContentProps {
  opportunity: OpportunityWithTheme;
  isOwner: boolean;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
}

export const IndexPageContent: React.FC<IndexPageContentProps> = ({
  opportunity,
  isOwner,
  isContactModalOpen,
  setIsContactModalOpen
}) => {
  const chatRef = useRef<CareerChatAssistantRef>(null);
  const { handleScrollToContact, handleScrollToSection, handleOpenChat, handleDashboardClick } = useIndexEventHandlers();

  // Check if this is the default resume (simplified layout)
  const isDefaultResume = opportunity?.theme.theme_id === 'default';

  const handleChatOpen = () => handleOpenChat(chatRef);

  console.log('Index: Rendering main content for opportunity:', opportunity.opportunity_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* User Top Bar - only show for authenticated opportunity owners */}
      {isOwner && (
        <UserTopBar onDashboardClick={handleDashboardClick} />
      )}
      
      <OpportunityHeader onScrollToContact={handleScrollToContact} />
      <HeroSection onScrollToSection={handleScrollToSection} onOpenChat={handleChatOpen} />
      
      {/* Only show these sections for non-default resumes */}
      {!isDefaultResume && (
        <>
          <AboutSection />
          <SkillsSection />
          <ToolsSection />
        </>
      )}
      
      {/* Show InquiryTypesSection only for default resume */}
      {isDefaultResume && <InquiryTypesSection />}
      
      {/* Only show these sections for non-default resumes */}
      {!isDefaultResume && (
        <>
          <ExperienceSection />
          <WhySupportSection />
        </>
      )}
      
      <ContactSection onOpenChat={handleChatOpen} />
      <Footer />
      
      <CareerChatAssistant ref={chatRef} />
      <ContactEmailModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};
