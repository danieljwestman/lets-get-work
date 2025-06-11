
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createAnalyticsDemoData, clearExistingAnalytics } from '../services/demoDataService';
import { toast } from '@/hooks/use-toast';
import { DeleteConfirmation } from '@/components/admin/shared/DeleteConfirmation';

interface AnalyticsDemoManagerProps {
  onDataChange?: () => void;
}

export const AnalyticsDemoManager: React.FC<AnalyticsDemoManagerProps> = ({ onDataChange }) => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleCreateDemoData = async () => {
    setIsCreating(true);
    setMessage('');
    
    try {
      const result = await createAnalyticsDemoData();
      if (result.success) {
        const successMessage = `✅ Created ${result.count} demo analytics events successfully!`;
        setMessage(successMessage);
        toast({
          title: "Demo Data Created",
          description: `Created ${result.count} analytics events`,
          variant: "success",
        });
        
        // Force data refresh with a small delay to ensure database is updated
        setTimeout(() => {
          if (onDataChange) {
            onDataChange();
          }
        }, 500);
      } else {
        const errorMessage = `❌ Failed to create demo data: ${result.error}`;
        setMessage(errorMessage);
        toast({
          title: "Error",
          description: "Failed to create demo data",
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
      const errorMessage = '❌ No authenticated user found';
      setMessage(errorMessage);
      toast({
        title: "Authentication Required",
        description: "Please log in to clear analytics data",
        variant: "destructive",
      });
      return;
    }

    setIsClearing(true);
    setMessage('');
    
    try {
      console.log('AnalyticsDemoManager: Starting clear operation for user:', user.id);
      const result = await clearExistingAnalytics(user.id);
      
      if (result.success) {
        const successMessage = `✅ Cleared ${result.cleared} analytics records successfully!`;
        setMessage(successMessage);
        toast({
          title: "Data Cleared",
          description: `Cleared ${result.cleared} analytics records`,
          variant: "success",
        });
        
        // Force data refresh with a small delay to ensure database is updated
        setTimeout(() => {
          console.log('AnalyticsDemoManager: Triggering data refresh after clear');
          if (onDataChange) {
            onDataChange();
          }
        }, 500);
      } else {
        const errorMessage = `❌ Failed to clear data: ${result.error}`;
        setMessage(errorMessage);
        toast({
          title: "Error",
          description: "Failed to clear analytics data",
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Analytics Demo Data Manager
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
            entityName="all analytics data"
            entityType="Analytics Data"
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
          <p>Use this to populate the analytics dashboard with realistic demo data for testing purposes.</p>
          <p>Demo data will be created spanning approximately 3 months with realistic session patterns and event distributions.</p>
          <p className="text-blue-600 mt-1">Note: The exact date range depends on when the data is generated and may vary slightly.</p>
        </div>
      </CardContent>
    </Card>
  );
};
