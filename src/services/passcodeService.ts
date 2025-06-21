
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY_PREFIX = 'opportunity_access_';

export const passcodeService = {
  // Verify passcode with server using profile_id and opportunity_id
  async verifyPasscodeWithServer(passcode: string, profileId: string, opportunityId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('verify_opportunity_passcode', {
        profile_id_param: profileId,
        opportunity_id_param: opportunityId,
        passcode_param: passcode
      });

      if (error) {
        console.error('passcodeService: RPC error:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('passcodeService: Error:', error);
      return false;
    }
  },

  // Check stored passcode in localStorage
  getStoredPasscode(opportunityId: string): string | null {
    try {
      return localStorage.getItem(`${STORAGE_KEY_PREFIX}${opportunityId}`);
    } catch (error) {
      console.error('passcodeService: Error accessing localStorage:', error);
      return null;
    }
  },

  // Store valid passcode in localStorage
  storePasscode(opportunityId: string, passcode: string): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${opportunityId}`, passcode);
    } catch (error) {
      console.error('passcodeService: Error storing passcode:', error);
    }
  },

  // Clear stored passcode
  clearPasscode(opportunityId: string): void {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${opportunityId}`);
    } catch (error) {
      console.error('passcodeService: Error clearing passcode:', error);
    }
  },

  // Get passcode from URL params
  getPasscodeFromUrl(): string | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('passcode');
    } catch (error) {
      console.error('passcodeService: Error getting URL passcode:', error);
      return null;
    }
  },

  // Clean up URL passcode parameter
  cleanUrlPasscode(): void {
    try {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('passcode');
      window.history.replaceState({}, '', newUrl.toString());
    } catch (error) {
      console.warn('passcodeService: Could not clean URL:', error);
    }
  }
};
