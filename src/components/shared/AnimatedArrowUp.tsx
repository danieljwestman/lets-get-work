
import { ChevronUp } from "lucide-react";

interface AnimatedArrowUpProps {
  gradientColors: string;
  onClick: () => void;
}

export const AnimatedArrowUp = ({ gradientColors, onClick }: AnimatedArrowUpProps) => {
  return (
    <div className="flex justify-center py-8">
      <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={onClick}>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradientColors} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <ChevronUp className="w-5 h-5 text-purple-600 animate-bounce group-hover:animate-pulse" />
        </div>
      </div>
    </div>
  );
};
