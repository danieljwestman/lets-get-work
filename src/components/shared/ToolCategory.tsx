
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getIconComponent } from "@/utils/iconMapper";

interface Tool {
  name: string;
  color: string;
}

interface ToolCategoryData {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  tools: Tool[];
  highlight: string;
}

interface ToolCategoryProps {
  category: ToolCategoryData;
}

export const ToolCategory = React.memo(({ category }: ToolCategoryProps) => {
  const IconComponent = useMemo(() => getIconComponent(category.icon), [category.icon]);
  
  const renderTool = useMemo(() => (tool: Tool, index: number) => {
    const isLearning = tool.name.includes('(L)');
    const displayName = tool.name.replace(' (L)', '');
    
    const badgeContent = (
      <Badge 
        key={index} 
        className={`${tool.color} px-2 py-2 rounded-xl text-left transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer border-0 h-11 flex items-center w-full`}
      >
        <span className="font-semibold text-sm leading-tight">
          {displayName}
          {isLearning && <span className="text-[10px] ml-1">(L)</span>}
        </span>
      </Badge>
    );

    if (isLearning) {
      return (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Currently learning this tool</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return badgeContent;
  }, []);
  
  return (
    <TooltipProvider>
      <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:rotate-1 h-full flex flex-col">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{category.subtitle}</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-2.5">
                {category.tools.map(renderTool)}
              </div>
              <div className="flex justify-center mt-6">
                <Badge className="bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80 text-xs font-medium border border-gray-300 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-sm">
                  + much more
                </Badge>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-sm text-gray-700 italic text-center">
                <strong>{category.highlight.split('!')[0]}!</strong>
                {category.highlight.includes('!') && category.highlight.split('!')[1] && ` ${category.highlight.split('!')[1]}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
});

ToolCategory.displayName = "ToolCategory";
