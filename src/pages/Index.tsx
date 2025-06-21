
import React, { useState } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useIndexPageLogic } from '@/hooks/useIndexPageLogic';
import { passcodeService } from '@/services/passcodeService';
import { IndexPageStates } from '@/components/pages/IndexPageStates';

const Index = () => {
  const { opportunity, isLoading: opportunityLoading, error } = useOpportunity();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const {
    isOwner,
    hasAccess,
    showPasscodeModal,
    isProcessing,
    verifyPasscode: indexPageVerifyPasscode
  } = useIndexPageLogic();

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

  // Simple wrapper for passcode verification from modal
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
        // Use the verify function from useIndexPageLogic to update state
        return await indexPageVerifyPasscode(passcode);
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
