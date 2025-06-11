
import React, { useState, useEffect } from 'react';
import { Bell, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface NotificationPrefs {
  email_notifications: boolean;
  new_messages: boolean;
  system_alerts: boolean;
  marketing: boolean;
  frequency: string;
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export const NotificationPreferences: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [preferences, setPreferences] = useState<NotificationPrefs>({
    email_notifications: true,
    new_messages: true,
    system_alerts: true,
    marketing: false,
    frequency: 'immediate',
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  useEffect(() => {
    if (profile?.notification_preferences) {
      setPreferences(profile.notification_preferences as NotificationPrefs);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await updateProfile({
        notification_preferences: preferences
      });
      
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to save notification preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof NotificationPrefs] as any),
            [child]: value
          }
        };
      }
      return { ...prev, [key]: value };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Email Notifications</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <Label className="text-sm font-medium">Email notifications</Label>
                <p className="text-xs text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
            />
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Notification Types</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">New messages</Label>
                <p className="text-xs text-gray-500">Get notified when someone contacts you</p>
              </div>
              <Switch
                checked={preferences.new_messages}
                onCheckedChange={(checked) => updatePreference('new_messages', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">System alerts</Label>
                <p className="text-xs text-gray-500">Important system updates and alerts</p>
              </div>
              <Switch
                checked={preferences.system_alerts}
                onCheckedChange={(checked) => updatePreference('system_alerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Marketing updates</Label>
                <p className="text-xs text-gray-500">News and feature announcements</p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) => updatePreference('marketing', checked)}
              />
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Frequency</h4>
          
          <div>
            <Label className="text-sm font-medium">Notification frequency</Label>
            <Select
              value={preferences.frequency}
              onValueChange={(value) => updatePreference('frequency', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium text-gray-900">Quiet Hours</h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Enable quiet hours</Label>
              <p className="text-xs text-gray-500">Pause notifications during specified hours</p>
            </div>
            <Switch
              checked={preferences.quiet_hours.enabled}
              onCheckedChange={(checked) => updatePreference('quiet_hours.enabled', checked)}
            />
          </div>
          
          {preferences.quiet_hours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Start time</Label>
                <Input
                  type="time"
                  value={preferences.quiet_hours.start}
                  onChange={(e) => updatePreference('quiet_hours.start', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">End time</Label>
                <Input
                  type="time"
                  value={preferences.quiet_hours.end}
                  onChange={(e) => updatePreference('quiet_hours.end', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};
