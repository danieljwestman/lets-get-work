
import { useCallback } from 'react';

export const useIndexEventHandlers = () => {
  const handleScrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleScrollToContact = useCallback(() => {
    handleScrollToSection('contact');
  }, [handleScrollToSection]);

  const handleOpenChat = useCallback((chatRef: React.RefObject<any>) => {
    console.log('Index: handleOpenChat called');
    if (chatRef.current) {
      console.log('Index: Opening chat via ref');
      chatRef.current.openChat();
    } else {
      console.log('Index: Chat ref not available, setting state');
      // This would need to be handled by the parent component
    }
  }, []);

  const handleDashboardClick = useCallback(() => {
    console.log('Index: Dashboard button clicked from UserTopBar');
    window.location.href = '/dashboard';
  }, []);

  return {
    handleScrollToSection,
    handleScrollToContact,
    handleOpenChat,
    handleDashboardClick
  };
};
