
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBrowserTitle } from '@/hooks/useBrowserTitle';
import { useAuth } from '@/contexts/AuthContext';
import { useOpportunityConfig } from '@/hooks/useOpportunityConfig';
import { usePasscodeAccess } from '@/hooks/usePasscodeAccess';
import { passcodeService } from '@/services/passcodeService';
import { IndexPageStates } from '@/components/pages/IndexPageStates';

const OpportunityPresentation = () => {
  const { user } = useAuth();
  const { profileId, opportunityId } = useParams<{ profileId: string; opportunityId?: string }>();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  console.log('🔧 OPPORTUNITY PRESENTATION: Component starting with URL params:', {
    url: window.location.href,
    profileId,
    opportunityId: opportunityId || 'default'
  });
  
  // Use useOpportunityConfig directly with URL parameters for main domain routes
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

  console.log('🔧 OPPORTUNITY PRESENTATION: Current state debug:', {
    url: window.location.href,
    profileId,
    opportunityId: opportunityId || 'default',
    hasOpportunity: !!opportunity,
    opportunityIdFromData: opportunity?.opportunity_id,
    opportunityProfileId: opportunity?.profile_id,
    opportunityLoading,
    error,
    isOwner,
    hasAccess,
    showPasscodeModal,
    isProcessing,
    isProtected: opportunity?.is_passcode_protected,
    userId: user?.id,
    opportunityUserId: opportunity?.user_id
  });

  // Handle access logic for opportunity presentations
  React.useEffect(() => {
    if (!opportunity) {
      console.log('🔧 OPPORTUNITY PRESENTATION: No opportunity yet, waiting...', window.location.href);
      return;
    }

    console.log('🔧 OPPORTUNITY PRESENTATION: Processing opportunity access logic', {
      url: window.location.href,
      opportunityId: opportunity.opportunity_id,
      isProtected: opportunity.is_passcode_protected,
      isOwner
    });

    if (!opportunity.is_passcode_protected) {
      console.log('🔧 OPPORTUNITY PRESENTATION: Opportunity not protected, granting access');
      grantAccess();
      return;
    }

    // Check URL passcode first
    const urlPasscode = passcodeService.getPasscodeFromUrl();
    if (urlPasscode && opportunity.profile_id) {
      console.log('🔧 OPPORTUNITY PRESENTATION: Found passcode in URL, verifying...');
      startProcessing();
      
      passcodeService.verifyPasscodeWithServer(urlPasscode, opportunity.profile_id, opportunity.opportunity_id)
        .then(isValid => {
          if (isValid) {
            console.log('🔧 OPPORTUNITY PRESENTATION: Valid passcode found in URL');
            passcodeService.storePasscode(opportunity.opportunity_id, urlPasscode);
            grantAccess();
            passcodeService.cleanUrlPasscode();
          } else {
            console.log('🔧 OPPORTUNITY PRESENTATION: Invalid passcode in URL');
            denyAccess();
          }
        })
        .catch(error => {
          console.error('🔧 OPPORTUNITY PRESENTATION: Error verifying URL passcode:', error);
          denyAccess();
        });
      return;
    }

    // If user is owner, grant access
    if (isOwner) {
      console.log('🔧 OPPORTUNITY PRESENTATION: User is owner, granting access');
      grantAccess();
      return;
    }

    // Otherwise, deny access (will trigger passcode modal or stored passcode check)
    console.log('🔧 OPPORTUNITY PRESENTATION: Protected opportunity, denying access');
    denyAccess();
  }, [opportunity?.opportunity_id, opportunity?.is_passcode_protected, opportunity?.profile_id, isOwner, grantAccess, denyAccess, startProcessing]);

  // Passcode verification function for the modal
  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    if (!opportunity?.profile_id) {
      console.error('🔧 OPPORTUNITY PRESENTATION: No profile ID available for passcode verification');
      return false;
    }

    console.log('🔧 OPPORTUNITY PRESENTATION: Verifying passcode for opportunity:', {
      profileId: opportunity.profile_id,
      opportunityId: opportunity.opportunity_id
    });

    try {
      const isValid = await passcodeService.verifyPasscodeWithServer(
        passcode, 
        opportunity.profile_id, 
        opportunity.opportunity_id
      );
      
      console.log('🔧 OPPORTUNITY PRESENTATION: Passcode verification result:', isValid);
      
      if (isValid) {
        passcodeService.storePasscode(opportunity.opportunity_id, passcode);
        grantAccess();
      }
      
      return isValid;
    } catch (error) {
      console.error('🔧 OPPORTUNITY PRESENTATION: Error during passcode verification:', error);
      return false;
    }
  };

  console.log('🔧 OPPORTUNITY PRESENTATION: About to render IndexPageStates with:', {
    url: window.location.href,
    hasOpportunity: !!opportunity,
    opportunityLoading,
    error,
    isOwner,
    hasAccess,
    showPasscodeModal,
    isProcessing
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

export default OpportunityPresentation;
