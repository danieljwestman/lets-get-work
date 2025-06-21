
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBrowserTitle } from '@/hooks/useBrowserTitle';
import { useAuth } from '@/contexts/AuthContext';
import { usePasscodeAccess } from '@/hooks/usePasscodeAccess';
import { passcodeService } from '@/services/passcodeService';
import { IndexPageStates } from '@/components/pages/IndexPageStates';
import { useOpportunityConfig } from '@/hooks/useOpportunityConfig';

const OpportunityPresentation = () => {
  const { profileId, opportunityId } = useParams<{ profileId: string; opportunityId: string }>();
  const { user } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  console.log('OpportunityPresentation: Starting with profile ID:', profileId, 'opportunity ID:', opportunityId);
  
  // Use the standard opportunity config hook with profileId and opportunityId (defaulting to 'default' if not provided)
  const { opportunity, isLoading: opportunityLoading, error } = useOpportunityConfig(
    profileId || null, 
    opportunityId || 'default'
  );
  
  const {
    hasAccess,
    showPasscodeModal,
    isProcessing,
    grantAccess,
    denyAccess,
    startProcessing
  } = usePasscodeAccess(opportunity);

  // Check if current user is the owner of this opportunity
  const isOwner = user && opportunity && user.id === opportunity.user_id;

  useBrowserTitle();

  console.log('OpportunityPresentation: Current state:', {
    profileId,
    opportunityId: opportunityId || 'default',
    hasOpportunity: !!opportunity,
    opportunityLoading,
    error,
    isOwner,
    hasAccess,
    showPasscodeModal,
    isProcessing,
    isProtected: opportunity?.is_passcode_protected
  });

  // Handle access logic for opportunity presentations
  React.useEffect(() => {
    if (!opportunity) {
      console.log('OpportunityPresentation: No opportunity yet, waiting...');
      return;
    }

    console.log('OpportunityPresentation: Processing opportunity access logic', {
      opportunityId: opportunity.opportunity_id,
      isProtected: opportunity.is_passcode_protected,
      isOwner
    });

    if (!opportunity.is_passcode_protected) {
      console.log('OpportunityPresentation: Opportunity not protected, granting access');
      grantAccess();
      return;
    }

    // Check URL passcode first
    const urlPasscode = passcodeService.getPasscodeFromUrl();
    if (urlPasscode && opportunity.profile_id) {
      console.log('OpportunityPresentation: Found passcode in URL, verifying...');
      startProcessing();
      
      passcodeService.verifyPasscodeWithServer(urlPasscode, opportunity.profile_id, opportunity.opportunity_id)
        .then(isValid => {
          if (isValid) {
            console.log('OpportunityPresentation: Valid passcode found in URL');
            passcodeService.storePasscode(opportunity.opportunity_id, urlPasscode);
            grantAccess();
            passcodeService.cleanUrlPasscode();
          } else {
            console.log('OpportunityPresentation: Invalid passcode in URL');
            denyAccess();
          }
        })
        .catch(error => {
          console.error('OpportunityPresentation: Error verifying URL passcode:', error);
          denyAccess();
        });
      return;
    }

    // If user is owner, grant access
    if (isOwner) {
      console.log('OpportunityPresentation: User is owner, granting access');
      grantAccess();
      return;
    }

    // Otherwise, deny access (will trigger passcode modal or stored passcode check)
    console.log('OpportunityPresentation: Protected opportunity, denying access');
    denyAccess();
  }, [opportunity?.opportunity_id, opportunity?.is_passcode_protected, opportunity?.profile_id, isOwner, grantAccess, denyAccess, startProcessing]);

  // Passcode verification function for the modal
  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    if (!opportunity?.profile_id) {
      console.error('OpportunityPresentation: No profile ID available for passcode verification');
      return false;
    }

    console.log('OpportunityPresentation: Verifying passcode for opportunity:', {
      profileId: opportunity.profile_id,
      opportunityId: opportunity.opportunity_id
    });

    try {
      const isValid = await passcodeService.verifyPasscodeWithServer(
        passcode, 
        opportunity.profile_id, 
        opportunity.opportunity_id
      );
      
      console.log('OpportunityPresentation: Passcode verification result:', isValid);
      
      if (isValid) {
        passcodeService.storePasscode(opportunity.opportunity_id, passcode);
        grantAccess();
      }
      
      return isValid;
    } catch (error) {
      console.error('OpportunityPresentation: Error during passcode verification:', error);
      return false;
    }
  };

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

export default OpportunityPresentation;
