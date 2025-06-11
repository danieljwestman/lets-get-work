
import { ChevronDown } from "lucide-react";
import { AnimatedArrowProps } from "@/types";

export const AnimatedArrow = ({ targetSection, gradientColors, onClick }: AnimatedArrowProps) => {
  return (
    <div className="flex justify-center py-2">
      <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => onClick(targetSection)}>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradientColors} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <ChevronDown className="w-5 h-5 text-purple-600 animate-bounce group-hover:animate-pulse" />
        </div>
      </div>
    </div>
  );
};
