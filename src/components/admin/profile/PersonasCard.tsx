
import React from 'react';
import { Users, Plus, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const PersonasCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Professional Personas
        </CardTitle>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Persona
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Build Your Professional Personas
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Create multiple professional personas to tailor your outreach for different roles, industries, or 
            career paths. Each persona includes specific skills, experience highlights, introduction text, and 
            custom content to create compelling, personalized presentations for potential opportunities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-3xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Role-Specific Skills</h4>
              <p className="text-sm text-gray-600">Customize skills and experience highlights for different job types and industries</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Edit3 className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Custom Content</h4>
              <p className="text-sm text-gray-600">Tailor introduction text and presentation content for each career path</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Coming Soon
            </Badge>
            <span className="text-sm text-gray-500">
              Advanced persona management features in development
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
