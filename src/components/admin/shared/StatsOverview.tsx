
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { StatsCardProps } from '@/types/admin';

interface StatsOverviewProps {
  stats: StatsCardProps[];
}

const getColorClasses = (iconColor: string) => {
  // Map icon colors to consistent border and text colors
  const colorMap: Record<string, { border: string; text: string; subtitle: string }> = {
    'text-blue-600': { 
      border: 'border-l-blue-500', 
      text: 'text-blue-900', 
      subtitle: 'text-blue-600' 
    },
    'text-purple-600': { 
      border: 'border-l-purple-500', 
      text: 'text-purple-900', 
      subtitle: 'text-purple-600' 
    },
    'text-green-600': { 
      border: 'border-l-green-500', 
      text: 'text-green-900', 
      subtitle: 'text-green-600' 
    },
    'text-orange-600': { 
      border: 'border-l-orange-500', 
      text: 'text-orange-900', 
      subtitle: 'text-orange-600' 
    },
  };
  
  return colorMap[iconColor] || { 
    border: 'border-l-gray-500', 
    text: 'text-gray-900', 
    subtitle: 'text-gray-600' 
  };
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.iconColor);
        
        return (
          <Card key={index} className={`${colors.border} border-l-4 bg-white`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${colors.subtitle}`}>
                  {stat.title}
                </div>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-3xl font-bold ${colors.text}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
