
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Mail } from 'lucide-react';

export const DashboardNavigation: React.FC = () => {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-2">
        <TabsList className="bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 border-0 bg-transparent data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:shadow-none data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 rounded-lg"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 border-0 bg-transparent data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:shadow-none data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 rounded-lg"
          >
            <Mail className="h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden max-w-7xl mx-auto px-6 py-4 border-t border-gray-100">
        <TabsList className="bg-transparent p-0 h-auto w-full">
          <div className="flex gap-1 w-full">
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 border-0 bg-transparent data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:shadow-none data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 rounded-lg flex-1 justify-center"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 border-0 bg-transparent data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:shadow-none data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50 rounded-lg flex-1 justify-center"
            >
              <Mail className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </div>
        </TabsList>
      </div>
    </>
  );
};
