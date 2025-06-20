
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBrowserTitle } from '@/hooks/useBrowserTitle';
import { useIndexPageLogic } from '@/hooks/useIndexPageLogic';
import { IndexPageStates } from '@/components/pages/IndexPageStates';

const ProfilePresentation = () => {
  const { profileId } = useParams<{ profileId: string }>();
  
  // Use the same hooks as Index page for consistency
  useBrowserTitle();
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

  console.log('ProfilePresentation: Rendering for profile ID:', profileId, {
    hasOpportunity: !!opportunity,
    opportunityLoading,
    error
  });

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

export default ProfilePresentation;
