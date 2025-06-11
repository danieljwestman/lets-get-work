
import React from 'react';
import { useBrowserTitle } from '@/hooks/useBrowserTitle';
import { useIndexPageLogic } from '@/hooks/useIndexPageLogic';
import { IndexPageStates } from '@/components/pages/IndexPageStates';

const Index = () => {
  // Update browser title based on opportunity config
  useBrowserTitle();
  
  // Get all the page logic and state
  const {
    opportunity,
    opportunityLoading,
    error,
    user,
    isOwner,
    hasAccess,
    showPasscodeModal,
    isProcessing,
    isChatOpen,
    setIsChatOpen,
    isContactModalOpen,
    setIsContactModalOpen,
    verifyPasscode
  } = useIndexPageLogic();

  return (
    <IndexPageStates
      opportunity={opportunity}
      opportunityLoading={opportunityLoading}
      error={error}
      isOwner={isOwner}
      hasAccess={hasAccess}
      showPasscodeModal={showPasscodeModal}
      isProcessing={isProcessing}
      isContactModalOpen={isContactModalOpen}
      setIsContactModalOpen={setIsContactModalOpen}
      verifyPasscode={verifyPasscode}
    />
  );
};

export default Index;
