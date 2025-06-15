
import { useState, useCallback, useEffect } from 'react';
import { OpportunityWithTheme } from '@/types/opportunity';
import { passcodeService } from '@/services/passcodeService';

export const usePasscodeAccess = (opportunity: OpportunityWithTheme | null) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('usePasscodeAccess: Current state:', {
    hasAccess,
    showPasscodeModal,
    isProcessing,
    opportunityId: opportunity?.opportunity_id,
    isProtected: opportunity?.is_passcode_protected
  });

  // Reset state when opportunity changes
  useEffect(() => {
    if (!opportunity) {
      console.log('usePasscodeAccess: No opportunity, resetting state');
      setHasAccess(false);
      setShowPasscodeModal(false);
      setIsProcessing(false);
    } else if (!opportunity.is_passcode_protected) {
      console.log('usePasscodeAccess: Opportunity not protected, granting access');
      setHasAccess(true);
      setShowPasscodeModal(false);
      setIsProcessing(false);
    } else {
      console.log('usePasscodeAccess: Protected opportunity detected, will need verification');
      setHasAccess(false);
      setShowPasscodeModal(false);
      setIsProcessing(false);
    }
  }, [opportunity?.opportunity_id, opportunity?.is_passcode_protected]);

  const grantAccess = useCallback(() => {
    console.log('usePasscodeAccess: Granting access');
    setHasAccess(true);
    setShowPasscodeModal(false);
    setIsProcessing(false);
  }, []);

  const denyAccess = useCallback(async () => {
    console.log('usePasscodeAccess: Denying access');
    setHasAccess(false);
    setIsProcessing(false);
    
    // Check localStorage before showing modal
    if (opportunity?.opportunity_id && opportunity?.profile_id) {
      const storedPasscode = passcodeService.getStoredPasscode(opportunity.opportunity_id);
      
      if (storedPasscode) {
        console.log('usePasscodeAccess: Found stored passcode, verifying...');
        try {
          // For now, we'll use a simple verification since we don't have profile-based verification yet
          const isValid = await passcodeService.verifyPasscodeWithServer(storedPasscode, opportunity.profile_id);
          if (isValid) {
            console.log('usePasscodeAccess: Valid stored passcode found, granting access');
            setHasAccess(true);
            setShowPasscodeModal(false);
            return;
          } else {
            console.log('usePasscodeAccess: Invalid stored passcode, clearing');
            passcodeService.clearPasscode(opportunity.opportunity_id);
          }
        } catch (error) {
          console.error('usePasscodeAccess: Error verifying stored passcode:', error);
          passcodeService.clearPasscode(opportunity.opportunity_id);
        }
      }
    }
    
    // Show modal if no valid stored passcode
    console.log('usePasscodeAccess: Showing passcode modal');
    setShowPasscodeModal(true);
  }, [opportunity?.opportunity_id, opportunity?.profile_id]);

  const startProcessing = useCallback(() => {
    console.log('usePasscodeAccess: Starting processing');
    setIsProcessing(true);
    setShowPasscodeModal(false);
    setHasAccess(false);
  }, []);

  const resetState = useCallback(() => {
    console.log('usePasscodeAccess: Resetting state');
    setHasAccess(false);
    setShowPasscodeModal(false);
    setIsProcessing(false);
  }, []);

  return {
    hasAccess,
    showPasscodeModal,
    isProcessing,
    grantAccess,
    denyAccess,
    startProcessing,
    resetState
  };
};
