
import { useEffect, useState, useRef, useCallback } from 'react';
import { useOpportunity } from '@/contexts/OpportunityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { usePasscodeAccess } from '@/hooks/usePasscodeAccess';
import { passcodeService } from '@/services/passcodeService';
import { useDomainContext } from '@/hooks/useDomainContext';

export const useIndexPageLogic = () => {
  const { opportunity, isLoading: opportunityLoading, error } = useOpportunity();
  const { language } = useLanguage();
  const { user } = useAuth();
  const analytics = useAnalytics();
  const domainInfo = useDomainContext();
  
  const { 
    hasAccess, 
    showPasscodeModal, 
    isProcessing,
    grantAccess,
    denyAccess,
    startProcessing,
    resetState
  } = usePasscodeAccess(opportunity);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const pageViewTracked = useRef(false);

  // Check if current user is the owner of this opportunity
  const isOwner = user && opportunity && user.id === opportunity.user_id;

  console.log('Index: Render state:', {
    hasOpportunity: !!opportunity,
    opportunityLoading,
    error,
    isOwner,
    isAuthenticated: !!user,
    hasAccess,
    showPasscodeModal,
    isProcessing,
    isProtected: opportunity?.is_passcode_protected,
    passcodeSet: !!opportunity?.access_passcode,
    isMainDomain: domainInfo?.isMainDomain
  });

  // Handle passcode verification logic - only for non-main domains
  useEffect(() => {
    // Skip passcode logic for main domains
    if (domainInfo?.isMainDomain) {
      console.log('IndexPageLogic: Main domain detected, skipping passcode logic');
      return;
    }

    const handlePasscodeVerification = async () => {
      console.log('Index: handlePasscodeVerification triggered with opportunity:', {
        hasOpportunity: !!opportunity,
        opportunityId: opportunity?.opportunity_id,
        isProtected: opportunity?.is_passcode_protected,
        isAuthenticated: !!user,
        isOwner
      });

      if (!opportunity) {
        console.log('Index: No opportunity, resetting state');
        resetState();
        return;
      }

      if (!opportunity.is_passcode_protected) {
        console.log('Index: Opportunity not protected, granting access');
        grantAccess();
        return;
      }

      const urlPasscode = passcodeService.getPasscodeFromUrl();
      if (urlPasscode && opportunity.profile_id) {
        console.log('Index: Found passcode in URL, verifying...');
        startProcessing();
        try {
          const isValid = await passcodeService.verifyPasscodeWithServer(urlPasscode, opportunity.profile_id, opportunity.opportunity_id);
          if (isValid) {
            console.log('Index: Valid passcode found in URL - universal access granted');
            passcodeService.storePasscode(opportunity.opportunity_id, urlPasscode);
            grantAccess();
            passcodeService.cleanUrlPasscode();
            return;
          } else {
            console.log('Index: Invalid passcode in URL');
            denyAccess();
            return;
          }
        } catch (error) {
          console.error('Index: Error verifying URL passcode:', error);
          denyAccess();
          return;
        }
      }

      if (!user) {
        console.log('Index: Protected opportunity, user not authenticated, denying access');
        denyAccess();
        return;
      }

      if (isOwner) {
        console.log('Index: User is authenticated owner of protected opportunity, granting access');
        grantAccess();
        return;
      }

      console.log('Index: User is authenticated but not owner, denying access');
      denyAccess();
    };

    if (opportunity) {
      handlePasscodeVerification();
    }
  }, [opportunity?.opportunity_id, opportunity?.is_passcode_protected, opportunity?.profile_id, user?.id, isOwner, grantAccess, denyAccess, startProcessing, resetState, domainInfo?.isMainDomain]);

  // Page view tracking effect - only for non-main domains
  useEffect(() => {
    // Skip analytics for main domains
    if (domainInfo?.isMainDomain) {
      return;
    }

    if (opportunity?.opportunity_id && !opportunityLoading && analytics.isReady() && 
        (hasAccess || !opportunity.is_passcode_protected) && !pageViewTracked.current) {
      console.log('Index: Tracking page view for opportunity:', opportunity.opportunity_id);
      analytics.trackPageView({
        opportunity_id: opportunity.opportunity_id,
        theme_id: opportunity.theme_id,
        company_name: opportunity.company_name || opportunity.theme.name,
        language: language
      });
      pageViewTracked.current = true;
    }
  }, [opportunity?.opportunity_id, opportunityLoading, analytics, hasAccess, language, domainInfo?.isMainDomain]);

  // Reset page view tracking when opportunity changes
  useEffect(() => {
    pageViewTracked.current = false;
  }, [opportunity?.opportunity_id]);

  // Verify passcode function for modal
  const verifyPasscode = async (enteredPasscode: string): Promise<boolean> => {
    console.log('Index: verifyPasscode called');
    
    if (!opportunity || !opportunity.profile_id) {
      console.error('Index: No opportunity or profile ID available');
      return false;
    }

    try {
      const isValid = await passcodeService.verifyPasscodeWithServer(enteredPasscode, opportunity.profile_id, opportunity.opportunity_id);
      console.log('Index: Passcode validation result:', isValid);
      
      if (isValid) {
        passcodeService.storePasscode(opportunity.opportunity_id, enteredPasscode);
        grantAccess();
        console.log('Index: Access granted, modal hidden');
      }

      return isValid;
    } catch (error) {
      console.error('Index: Error verifying passcode:', error);
      return false;
    }
  };

  return {
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
  };
};
