
import React, { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useDebugEnvironment } from '@/components/shared/debug/hooks/useDebugEnvironment';

export const DeveloperSettings: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const { debugToolsEnabled, toggleDebugTools } = useDebugEnvironment();
  const [saving, setSaving] = useState(false);

  const handleToggleDebug = async (enabled: boolean) => {
    setSaving(true);
    
    try {
      // Update localStorage immediately for instant UI effect
      toggleDebugTools(enabled);
      
      // Also update the profile if user is authenticated
      if (profile) {
        await updateProfile({
          debug_tools_enabled: enabled
        });
      }
      
      toast({
        title: enabled ? "Debug tools enabled" : "Debug tools disabled",
        description: enabled 
          ? "Debug tools are now visible in the bottom left corner." 
          : "Debug tools have been hidden.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update debug settings. Please try again.",
        variant: "destructive",
      });
      // Revert the change on error
      toggleDebugTools(!enabled);
    } finally {
      setSaving(false);
    }
  };

  // Sync profile setting with localStorage on profile load
  useEffect(() => {
    if (profile?.debug_tools_enabled !== undefined && profile.debug_tools_enabled !== debugToolsEnabled) {
      toggleDebugTools(profile.debug_tools_enabled);
    }
  }, [profile?.debug_tools_enabled]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bug className="h-4 w-4 text-gray-500" />
          <div>
            <Label className="text-sm font-medium">Debug Tools</Label>
            <p className="text-xs text-gray-500">
              Show debug information panel for troubleshooting
            </p>
          </div>
        </div>
        <Switch
          checked={debugToolsEnabled}
          onCheckedChange={handleToggleDebug}
          disabled={saving}
        />
      </div>
      
      {debugToolsEnabled && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Debug tools are now enabled. Look for the debug panel in the bottom left corner.
          </p>
        </div>
      )}
    </div>
  );
};
