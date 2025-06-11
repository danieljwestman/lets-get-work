
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createMessagesDemoData, clearExistingMessages } from './services/messagesDemoDataService';
import { toast } from '@/hooks/use-toast';
import { DeleteConfirmation } from './shared/DeleteConfirmation';

interface MessagesDemoManagerProps {
  onDataChange?: () => void;
}

export const MessagesDemoManager: React.FC<MessagesDemoManagerProps> = ({ onDataChange }) => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleCreateDemoData = async () => {
    if (!user) {
      const errorMessage = '❌ You must be logged in to create demo data';
      setMessage(errorMessage);
      toast({
        title: "Authentication Required",
        description: "Please log in to create demo data",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    setMessage('');
    
    try {
      console.log('MessagesDemoManager: Starting demo data creation for user:', user.id);
      const result = await createMessagesDemoData();
      
      if (result.success && 'count' in result) {
        const successMessage = `✅ Created ${result.count} demo messages successfully!`;
        setMessage(successMessage);
        toast({
          title: "Demo Data Created",
          description: `Created ${result.count} demo messages`,
          variant: "default",
        });
        
        // Force data refresh with a small delay to ensure database is updated
        setTimeout(() => {
          if (onDataChange) {
            onDataChange();
          }
        }, 500);
      } else if (!result.success && 'error' in result) {
        const errorMessage = `❌ Failed to create demo data: ${result.error}`;
        setMessage(errorMessage);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = `❌ Error: ${error}`;
      setMessage(errorMessage);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClearData = async () => {
    if (!user) {
      const errorMessage = '❌ You must be logged in to clear messages';
      setMessage(errorMessage);
      toast({
        title: "Authentication Required",
        description: "Please log in to clear messages data",
        variant: "destructive",
      });
      return;
    }

    setIsClearing(true);
    setMessage('');
    
    try {
      console.log('MessagesDemoManager: Starting clear operation for user:', user.id);
      const result = await clearExistingMessages(user.id);
      
      if (result.success && 'cleared' in result) {
        const successMessage = `✅ Cleared ${result.cleared} message records successfully!`;
        setMessage(successMessage);
        toast({
          title: "Data Cleared",
          description: `Cleared ${result.cleared} message records`,
          variant: "default",
        });
        
        // Force data refresh with a small delay to ensure database is updated
        setTimeout(() => {
          console.log('MessagesDemoManager: Triggering data refresh after clear');
          if (onDataChange) {
            onDataChange();
          }
        }, 500);
      } else if (!result.success && 'error' in result) {
        const errorMessage = `❌ Failed to clear data: ${result.error}`;
        setMessage(errorMessage);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = `❌ Error: ${error}`;
      setMessage(errorMessage);
      toast({
        title: "Error", 
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Show login message if user is not authenticated
  if (!user) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Messages Demo Data Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            Please log in to create or manage demo messages data.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Messages Demo Data Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={handleCreateDemoData}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? 'Creating...' : 'Create Demo Data'}
          </Button>
          
          <DeleteConfirmation
            entityName="all messages data"
            entityType="Messages Data"
            onConfirm={handleClearData}
            isLoading={isClearing}
          >
            <Button
              disabled={isClearing}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isClearing ? 'Clearing...' : 'Clear Demo Data'}
            </Button>
          </DeleteConfirmation>
        </div>
        
        {message && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            {message}
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>Use this to populate the messages dashboard with realistic demo data for testing purposes.</p>
          <p>Demo data will be created for the past 45 days with realistic message patterns and inquiry types.</p>
          <p className="text-yellow-600 mt-2">Note: You must be logged in and have at least one opportunity to create demo messages.</p>
        </div>
      </CardContent>
    </Card>
  );
};
