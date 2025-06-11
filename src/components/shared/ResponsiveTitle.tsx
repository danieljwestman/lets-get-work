
import { useLanguage } from "@/contexts/LanguageContext";

interface ResponsiveTitleProps {
  titleKey: string;
  mobileTitleKey: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const ResponsiveTitle = ({ 
  titleKey, 
  mobileTitleKey, 
  className = "", 
  as: Component = 'h2' 
}: ResponsiveTitleProps) => {
  const { t } = useLanguage();

  return (
    <Component className={className}>
      <span className="md:hidden">{t(mobileTitleKey)}</span>
      <span className="hidden md:inline">{t(titleKey)}</span>
    </Component>
  );
};
