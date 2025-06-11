
import React from 'react';
import { Navigate } from 'react-router-dom';
import { PasscodeModal } from '@/components/auth/PasscodeModal';
import { AppLoadingWrapper } from '@/components/shared/AppLoadingWrapper';
import { IndexPageContent } from './IndexPageContent';
import { OpportunityWithTheme } from '@/types/opportunity';

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

  // If there's an error loading the opportunity, redirect to 404
  if (error && !opportunityLoading) {
    console.log('Index: Error detected, redirecting to NotFound:', error);
    return <Navigate to="/404" replace />;
  }

  // Show passcode modal for protected opportunities that require passcode entry
  if (opportunity?.is_passcode_protected && showPasscodeModal) {
    const personName = opportunity.owner_full_name?.trim() || 'the opportunity owner';
    console.log('Index: Showing passcode modal for protected opportunity with personName:', personName);
    return (
      <AppLoadingWrapper>
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
    return <AppLoadingWrapper>Loading opportunity...</AppLoadingWrapper>;
  }

  // Wait for access verification to complete for protected opportunities
  if (opportunity.is_passcode_protected && (!hasAccess || isProcessing)) {
    console.log('Index: Waiting for access verification');
    return <AppLoadingWrapper>Verifying access...</AppLoadingWrapper>;
  }

  // Render main content
  return (
    <AppLoadingWrapper>
      <IndexPageContent
        opportunity={opportunity}
        isOwner={isOwner}
        isContactModalOpen={isContactModalOpen}
        setIsContactModalOpen={setIsContactModalOpen}
      />
    </AppLoadingWrapper>
  );
};
