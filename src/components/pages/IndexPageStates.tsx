
import React from 'react';
import { PasscodeModal } from '@/components/auth/PasscodeModal';
import { AppLoadingWrapper } from '@/components/shared/AppLoadingWrapper';
import { IndexPageContent } from './IndexPageContent';
import { OpportunityWithTheme } from '@/types/opportunity';
import NotFound from '@/pages/NotFound';

interface IndexPageStatesProps {
  opportunity: OpportunityWithTheme | null;
  opportunityLoading: boolean;
  error: string | null;
  isOwner: boolean;
  hasAccess: boolean;
  showPasscodeModal: boolean;
  isProcessing: boolean;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  verifyPasscode: (passcode: string) => Promise<boolean>;
}

export const IndexPageStates: React.FC<IndexPageStatesProps> = ({
  opportunity,
  opportunityLoading,
  error,
  isOwner,
  hasAccess,
  showPasscodeModal,
  isProcessing,
  isContactModalOpen,
  setIsContactModalOpen,
  verifyPasscode
}) => {
  // Debug logging for owner name display
  React.useEffect(() => {
    if (opportunity) {
      console.log('🔧 INDEX PAGE STATES: Opportunity data received:', {
        url: window.location.href,
        opportunity_id: opportunity.opportunity_id,
        user_id: opportunity.user_id,
        owner_full_name: opportunity.owner_full_name,
        contact_person: opportunity.contact_person,
        is_passcode_protected: opportunity.is_passcode_protected,
        showPasscodeModal
      });
    }
  }, [opportunity, showPasscodeModal]);

  console.log('🔧 INDEX PAGE STATES: Render decision logic:', {
    url: window.location.href,
    hasError: !!error,
    error: error,
    opportunityLoading,
    hasOpportunity: !!opportunity,
    opportunityId: opportunity?.opportunity_id,
    isPasscodeProtected: opportunity?.is_passcode_protected,
    showPasscodeModal,
    hasAccess,
    isProcessing,
    shouldShowNotFound: error && !opportunityLoading && !opportunity
  });

  // Only render NotFound if there's an error AND no opportunity data AND not loading
  // This prevents showing 404 during race conditions where we have opportunity data but temporary errors
  if (error && !opportunityLoading && !opportunity) {
    console.log('🔧 INDEX PAGE STATES: Error detected with no opportunity data, rendering NotFound component:', {
      url: window.location.href,
      error,
      opportunityLoading,
      hasOpportunity: !!opportunity
    });
    return <NotFound />;
  }

  // Show passcode modal for protected opportunities that require passcode entry
  if (opportunity?.is_passcode_protected && showPasscodeModal) {
    const personName = opportunity.owner_full_name?.trim() || 'the opportunity owner';
    console.log('🔧 INDEX PAGE STATES: Showing passcode modal for protected opportunity:', {
      url: window.location.href,
      personName,
      opportunityId: opportunity.opportunity_id
    });
    return (
      <AppLoadingWrapper isDashboard={false}>
        <PasscodeModal
          isOpen={true}
          personName={personName}
          onPasscodeVerify={verifyPasscode}
        />
      </AppLoadingWrapper>
    );
  }

  // Wait for opportunity to load completely
  if (opportunityLoading || !opportunity) {
    console.log('🔧 INDEX PAGE STATES: Still loading opportunity or no opportunity found:', {
      url: window.location.href,
      opportunityLoading,
      hasOpportunity: !!opportunity
    });
    return <AppLoadingWrapper isDashboard={false}>Loading opportunity...</AppLoadingWrapper>;
  }

  // Wait for access verification to complete for protected opportunities
  if (opportunity.is_passcode_protected && (!hasAccess || isProcessing)) {
    console.log('🔧 INDEX PAGE STATES: Waiting for access verification:', {
      url: window.location.href,
      hasAccess,
      isProcessing,
      opportunityId: opportunity.opportunity_id
    });
    return <AppLoadingWrapper isDashboard={false}>Verifying access...</AppLoadingWrapper>;
  }

  // Render main content - this will now wait for translations to be ready
  console.log('🔧 INDEX PAGE STATES: Rendering main content for opportunity:', {
    url: window.location.href,
    opportunityId: opportunity.opportunity_id,
    profileId: opportunity.profile_id,
    isOwner
  });
  
  return (
    <AppLoadingWrapper isDashboard={false}>
      <IndexPageContent
        opportunity={opportunity}
        isOwner={isOwner}
        isContactModalOpen={isContactModalOpen}
        setIsContactModalOpen={setIsContactModalOpen}
      />
    </AppLoadingWrapper>
  );
};
