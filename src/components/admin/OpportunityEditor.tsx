
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, Globe, Lock } from 'lucide-react';
import { OpportunityBasicInfo } from './OpportunityBasicInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOpportunityEditor } from './hooks/useOpportunityEditor';

interface OpportunityEditorProps {
  opportunityId?: string | null;
  onBack: () => void;
  isCreating?: boolean;
}

export const OpportunityEditor: React.FC<OpportunityEditorProps> = ({ 
  opportunityId, 
  onBack, 
  isCreating = false 
}) => {
  const {
    opportunity,
    loading,
    error,
    updateOpportunity,
    saveOpportunity,
    isSaving
  } = useOpportunityEditor(opportunityId);

  const [activeTab, setActiveTab] = useState('basic');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSave = async () => {
    const success = await saveOpportunity();
    if (success) {
      onBack();
    }
  };

  const opportunityName = opportunity?.name || 'New Opportunity';
  const subdomain = opportunity?.subdomain || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {isCreating ? 'Create Opportunity' : `Edit ${opportunityName}`}
              {opportunity?.is_passcode_protected && (
                <Lock className="h-5 w-5 text-gray-500" />
              )}
            </h1>
            {subdomain && (
              <div className="flex items-center gap-2 mt-1">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {subdomain === 'default' ? 'default' : `${subdomain}.getdaniel.work`}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isCreating && subdomain && (
            <Button 
              variant="outline" 
              onClick={() => {
                const url = subdomain === 'default' ? '/' : `https://${subdomain}.getdaniel.work`;
                window.open(url, '_blank');
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      {opportunity && (
        <OpportunityBasicInfo 
          opportunity={opportunity} 
          onChange={updateOpportunity} 
        />
      )}
    </div>
  );
};
