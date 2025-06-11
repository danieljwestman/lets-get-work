
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useOpportunityTranslations } from "@/hooks/useOpportunityTranslations";
import { useAuth } from "@/contexts/AuthContext";
import { useOpportunity } from "@/contexts/OpportunityContext";

interface OpportunityHeaderProps {
  onScrollToContact: () => void;
}

export const OpportunityHeader = ({ onScrollToContact }: OpportunityHeaderProps) => {
  const { t } = useOpportunityTranslations();
  const { user } = useAuth();
  const { opportunity } = useOpportunity();

  // Check if current user is the owner of this opportunity
  const isOwner = user && opportunity && user.id === opportunity.user_id;

  return (
    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-40 pointer-events-none">
      {/* Mobile layout - badge left, toggle right */}
      <div className="flex sm:hidden justify-between items-center gap-3">
        <Badge 
          onClick={onScrollToContact}
          className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 px-4 py-2 text-sm font-medium hover:from-green-100 hover:to-emerald-100 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 flex-shrink-0 min-h-[40px] rounded-full shadow pointer-events-auto"
        >
          <Check className="w-4 h-4" />
          <span>{t('header.badge')}</span>
        </Badge>
        
        <div className="flex items-center gap-3 flex-shrink-0 pointer-events-auto">
          <LanguageToggle />
        </div>
      </div>

      {/* Desktop layout - centered badge and toggle */}
      <div className="hidden sm:flex justify-center items-center">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Badge 
            onClick={onScrollToContact}
            className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 px-4 py-2 text-sm font-medium hover:from-green-100 hover:to-emerald-100 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-105 rounded-full shadow"
          >
            <Check className="w-4 h-4" />
            <span>{t('header.badge')}</span>
          </Badge>

          <LanguageToggle />
        </div>
      </div>
    </div>
  );
};
