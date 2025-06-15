
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBrowserTitle } from '@/hooks/useBrowserTitle';
import { useIndexPageLogic } from '@/hooks/useIndexPageLogic';
import { IndexPageStates } from '@/components/pages/IndexPageStates';
import { useDomainContext } from '@/hooks/useDomainContext';

const Index = () => {
  const domainInfo = useDomainContext();
  
  // Update browser title based on opportunity config
  useBrowserTitle();
  
  // For main domains, redirect to dashboard or show marketing page
  if (domainInfo?.isMainDomain) {
    console.log('Index: Main domain detected, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // For subdomains and custom domains, show the opportunity presentation
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
