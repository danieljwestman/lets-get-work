
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
        opportunity_id: opportunity.opportunity_id,
        user_id: opportunity.user_id,
        owner_full_name: opportunity.owner_full_name,
        contact_person: opportunity.contact_person,
        is_passcode_protected: opportunity.is_passcode_protected,
        showPasscodeModal
      });
    }
  }, [opportunity, showPasscodeModal]);

  // Only render NotFound if there's an error AND no opportunity data AND not loading
  // This prevents showing 404 during race conditions where we have opportunity data but temporary errors
  if (error && !opportunityLoading && !opportunity) {
    console.log('🔧 INDEX PAGE STATES: Error detected with no opportunity data, rendering NotFound component:', error);
    return <NotFound />;
  }

  // Show passcode modal for protected opportunities that require passcode entry
  if (opportunity?.is_passcode_protected && showPasscodeModal) {
    const personName = opportunity.owner_full_name?.trim() || 'the opportunity owner';
    console.log('Index: Showing passcode modal for protected opportunity with personName:', personName);
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
    console.log('Index: Still loading opportunity or no opportunity found');
    return <AppLoadingWrapper isDashboard={false}>Loading opportunity...</AppLoadingWrapper>;
  }

  // Wait for access verification to complete for protected opportunities
  if (opportunity.is_passcode_protected && (!hasAccess || isProcessing)) {
    console.log('Index: Waiting for access verification');
    return <AppLoadingWrapper isDashboard={false}>Verifying access...</AppLoadingWrapper>;
  }

  // Render main content - this will now wait for translations to be ready
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
