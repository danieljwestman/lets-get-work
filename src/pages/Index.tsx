
import React, { useEffect, useState } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePasscodeAccess } from '@/hooks/usePasscodeAccess';
import { useIndexPageLogic } from '@/hooks/useIndexPageLogic';
import { passcodeService } from '@/services/passcodeService';
import { IndexPageStates } from '@/components/pages/IndexPageStates';

const Index = () => {
  const { opportunity, isLoading: opportunityLoading, error } = useOpportunity();
  const { user } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const {
    hasAccess,
    showPasscodeModal,
    isProcessing,
    grantAccess,
    denyAccess,
    startProcessing,
    resetState
  } = usePasscodeAccess(opportunity);

  const { isOwner } = useIndexPageLogic();

  console.log('Index: Rendering with state:', {
    hasOpportunity: !!opportunity,
    opportunityId: opportunity?.opportunity_id,
    profileId: opportunity?.profile_id,
    isProtected: opportunity?.is_passcode_protected,
    hasAccess,
    showPasscodeModal,
    isProcessing,
    isOwner,
    opportunityLoading,
    error
  });

  // Handle access verification for protected opportunities
  useEffect(() => {
    const handleAccessVerification = async () => {
      if (!opportunity) {
        console.log('Index: No opportunity available');
        return;
      }

      // Owner always has access
      if (isOwner) {
        console.log('Index: User is owner, granting access');
        grantAccess();
        return;
      }

      // If not protected, grant access
      if (!opportunity.is_passcode_protected) {
        console.log('Index: Opportunity not protected, granting access');
        grantAccess();
        return;
      }

      console.log('Index: Protected opportunity detected, checking access');
      
      // Check if passcode is in URL first
      const urlPasscode = passcodeService.getPasscodeFromUrl();
      if (urlPasscode && opportunity.profile_id) {
        console.log('Index: Found passcode in URL, verifying...');
        startProcessing();
        
        try {
          const isValid = await passcodeService.verifyPasscodeWithServer(
            urlPasscode, 
            opportunity.profile_id, 
            opportunity.opportunity_id
          );
          
          if (isValid) {
            console.log('Index: URL passcode is valid, granting access');
            passcodeService.storePasscode(opportunity.opportunity_id, urlPasscode);
            passcodeService.cleanUrlPasscode();
            grantAccess();
            return;
          } else {
            console.log('Index: URL passcode is invalid');
            passcodeService.cleanUrlPasscode();
          }
        } catch (error) {
          console.error('Index: Error verifying URL passcode:', error);
          passcodeService.cleanUrlPasscode();
        }
      }

      // If no valid URL passcode, deny access (this will check stored passcode)
      denyAccess();
    };

    handleAccessVerification();
  }, [opportunity, isOwner, grantAccess, denyAccess, startProcessing]);

  // Reset access state when opportunity changes
  useEffect(() => {
    console.log('Index: Opportunity changed, resetting access state');
    resetState();
  }, [opportunity?.opportunity_id, resetState]);

  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    if (!opportunity?.profile_id) {
      console.error('Index: No profile ID available for passcode verification');
      return false;
    }

    console.log('Index: Verifying passcode for opportunity:', {
      profileId: opportunity.profile_id,
      opportunityId: opportunity.opportunity_id
    });

    try {
      const isValid = await passcodeService.verifyPasscodeWithServer(
        passcode, 
        opportunity.profile_id, 
        opportunity.opportunity_id
      );
      
      console.log('Index: Passcode verification result:', isValid);
      
      if (isValid) {
        passcodeService.storePasscode(opportunity.opportunity_id, passcode);
        grantAccess();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Index: Error during passcode verification:', error);
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

export default Index;
