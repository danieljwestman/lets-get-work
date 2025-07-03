import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOpportunityConfig } from '@/hooks/useOpportunityConfig';
import { usePasscodeAccess } from '@/hooks/usePasscodeAccess';
import { useSimpleTranslations } from '@/hooks/useSimpleTranslations';
import { passcodeService } from '@/services/passcodeService';
import { PasscodeModal } from '@/components/auth/PasscodeModal';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { OpportunityPrintContent } from '@/components/print/OpportunityPrintContent';

const OpportunityPrintResume = () => {
  const { user } = useAuth();
  const { profileId, opportunityId } = useParams<{ profileId: string; opportunityId: string }>();
  
  console.log('🖨️ PRINT RESUME: Component starting with URL params:', {
    url: window.location.href,
    profileId,
    opportunityId
  });
  
  // Use useOpportunityConfig directly with URL parameters and direct flag for main domain routes
  const { opportunity, isLoading: opportunityLoading, error } = useOpportunityConfig(
    profileId || null, 
    opportunityId || 'default',
    true // isDirect flag for main domain routes
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

  console.log('🖨️ PRINT RESUME: Current state debug:', {
    url: window.location.href,
    profileId,
    opportunityId,
    hasOpportunity: !!opportunity,
    opportunityIdFromData: opportunity?.opportunity_id,
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
      console.log('🖨️ PRINT RESUME: No opportunity yet, waiting...', window.location.href);
      return;
    }

    console.log('🖨️ PRINT RESUME: Processing opportunity access logic', {
      url: window.location.href,
      opportunityId: opportunity.opportunity_id,
      isProtected: opportunity.is_passcode_protected,
      isOwner
    });

    if (!opportunity.is_passcode_protected) {
      console.log('🖨️ PRINT RESUME: Opportunity not protected, granting access');
      grantAccess();
      return;
    }

    // Check URL passcode first
    const urlPasscode = passcodeService.getPasscodeFromUrl();
    if (urlPasscode && opportunity.profile_id) {
      console.log('🖨️ PRINT RESUME: Found passcode in URL, verifying...');
      startProcessing();
      
      passcodeService.verifyPasscodeWithServer(urlPasscode, opportunity.profile_id, opportunity.opportunity_id)
        .then(isValid => {
          if (isValid) {
            console.log('🖨️ PRINT RESUME: Valid passcode found in URL');
            passcodeService.storePasscode(opportunity.opportunity_id, urlPasscode);
            grantAccess();
            passcodeService.cleanUrlPasscode();
          } else {
            console.log('🖨️ PRINT RESUME: Invalid passcode in URL');
            denyAccess();
          }
        })
        .catch(error => {
          console.error('🖨️ PRINT RESUME: Error verifying URL passcode:', error);
          denyAccess();
        });
      return;
    }

    // If user is owner, grant access
    if (isOwner) {
      console.log('🖨️ PRINT RESUME: User is owner, granting access');
      grantAccess();
      return;
    }

    // Otherwise, deny access (will trigger passcode modal or stored passcode check)
    console.log('🖨️ PRINT RESUME: Protected opportunity, denying access');
    denyAccess();
  }, [opportunity?.opportunity_id, opportunity?.is_passcode_protected, opportunity?.profile_id, isOwner, grantAccess, denyAccess, startProcessing]);

  // Passcode verification function for the modal
  const verifyPasscode = async (passcode: string): Promise<boolean> => {
    if (!opportunity?.profile_id) {
      console.error('🖨️ PRINT RESUME: No profile ID available for passcode verification');
      return false;
    }

    console.log('🖨️ PRINT RESUME: Verifying passcode for opportunity:', {
      profileId: opportunity.profile_id,
      opportunityId: opportunity.opportunity_id
    });

    try {
      const isValid = await passcodeService.verifyPasscodeWithServer(
        passcode, 
        opportunity.profile_id, 
        opportunity.opportunity_id
      );
      
      console.log('🖨️ PRINT RESUME: Passcode verification result:', isValid);
      
      if (isValid) {
        passcodeService.storePasscode(opportunity.opportunity_id, passcode);
        grantAccess();
      }
      
      return isValid;
    } catch (error) {
      console.error('🖨️ PRINT RESUME: Error during passcode verification:', error);
      return false;
    }
  };

  // Show loading state
  if (opportunityLoading) {
    return <LoadingScreen />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Resume</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Show 404 if no opportunity found
  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Resume Not Found</h1>
          <p className="text-muted-foreground">The requested resume could not be found.</p>
        </div>
      </div>
    );
  }

  // Show passcode modal if needed
  if (showPasscodeModal) {
    return (
      <PasscodeModal
        isOpen={showPasscodeModal}
        personName={opportunity.name}
        onPasscodeVerify={verifyPasscode}
        onClose={() => window.history.back()}
      />
    );
  }

  // Show access denied if no access
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Required</h1>
          <p className="text-muted-foreground">You need access to view this resume.</p>
        </div>
      </div>
    );
  }

  // Only opportunity owners can access the print resume
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You can only view your own print resume.</p>
        </div>
      </div>
    );
  }

  console.log('🖨️ PRINT RESUME: About to render print content with:', {
    url: window.location.href,
    hasOpportunity: !!opportunity,
    isOwner,
    hasAccess
  });

  return (
    <ErrorBoundary>
      <OpportunityPrintContent opportunity={opportunity} />
    </ErrorBoundary>
  );
};

export default OpportunityPrintResume;
