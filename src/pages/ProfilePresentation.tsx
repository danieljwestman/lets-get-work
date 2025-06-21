
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBrowserTitle } from '@/hooks/useBrowserTitle';
import { useAuth } from '@/contexts/AuthContext';
import { usePasscodeAccess } from '@/hooks/usePasscodeAccess';
import { passcodeService } from '@/services/passcodeService';
import { IndexPageStates } from '@/components/pages/IndexPageStates';
import { useOpportunityConfig } from '@/hooks/useOpportunityConfig';

const ProfilePresentation = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { user } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  console.log('ProfilePresentation: Starting with profile ID:', profileId);
  
  // For main domain profile routes, fetch the default opportunity for the given profile
  const { opportunity, isLoading: opportunityLoading, error } = useOpportunityConfig(profileId || null, 'default');
  
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

  console.log('ProfilePresentation: Current state:', {
    profileId,
    hasOpportunity: !!opportunity,
    opportunityLoading,
    error,
    isOwner,
    hasAccess,
    showPasscodeModal,
    isProcessing,
    isProtected: opportunity?.is_passcode_protected
  });

  // Handle access logic for profile presentations
  React.useEffect(() => {
    if (!opportunity) {
      console.log('ProfilePresentation: No opportunity yet, waiting...');
      return;
    }

    console.log('ProfilePresentation: Processing opportunity access logic', {
      opportunityId: opportunity.opportunity_id,
      isProtected: opportunity.is_passcode_protected,
      isOwner
    });

    if (!opportunity.is_passcode_protected) {
      console.log('ProfilePresentation: Opportunity not protected, granting access');
      grantAccess();
      return;
    }

    // Check URL passcode first
    const urlPasscode = passcodeService.getPasscodeFromUrl();
    if (urlPasscode && opportunity.profile_id) {
      console.log('ProfilePresentation: Found passcode in URL, verifying...');
      startProcessing();
      
      passcodeService.verifyPasscodeWithServer(urlPasscode, opportunity.profile_id, opportunity.opportunity_id)
        .then(isValid => {
          if (isValid) {
            console.log('ProfilePresentation: Valid passcode found in URL');
            passcodeService.storePasscode(opportunity.opportunity_id, urlPasscode);
            grantAccess();
            passcodeService.cleanUrlPasscode();
          } else {
            console.log('ProfilePresentation: Invalid passcode in URL');
            denyAccess();
          }
        })
        .catch(error => {
          console.error('ProfilePresentation: Error verifying URL passcode:', error);
          denyAccess();
        });
      return;
    }

    // If user is owner, grant access
    if (isOwner) {
      console.log('ProfilePresentation: User is owner, granting access');
      grantAccess();
      return;
    }

    // Otherwise, deny access (will trigger passcode modal or stored passcode check)
    console.log('ProfilePresentation: Protected opportunity, denying access');
    denyAccess();
  }, [opportunity?.opportunity_id, opportunity?.is_passcode_protected, opportunity?.profile_id, isOwner, grantAccess, denyAccess, startProcessing]);

  // Passcode verification function for the modal
  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    if (!opportunity?.profile_id) {
      console.error('ProfilePresentation: No profile ID available for passcode verification');
      return false;
    }

    console.log('ProfilePresentation: Verifying passcode for opportunity:', {
      profileId: opportunity.profile_id,
      opportunityId: opportunity.opportunity_id
    });

    try {
      const isValid = await passcodeService.verifyPasscodeWithServer(
        passcode, 
        opportunity.profile_id, 
        opportunity.opportunity_id
      );
      
      console.log('ProfilePresentation: Passcode verification result:', isValid);
      
      if (isValid) {
        passcodeService.storePasscode(opportunity.opportunity_id, passcode);
        grantAccess();
      }
      
      return isValid;
    } catch (error) {
      console.error('ProfilePresentation: Error during passcode verification:', error);
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

export default ProfilePresentation;
