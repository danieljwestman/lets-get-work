
export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gradients: {
    hero: string;
    primary: string;
    secondary: string;
    arrow: {
      purple: string;
      blue: string;
      pink: string;
      green: string;
    };
  };
  spacing: {
    section: string;
    sectionSmall: string;
    container: string;
  };
  typography: {
    title: {
      mobile: string;
      desktop: string;
    };
    subtitle: {
      mobile: string;
      desktop: string;
    };
    body: {
      mobile: string;
      desktop: string;
    };
  };
  animations: {
    hover: string;
    hoverRotate: string;
    hoverRotateNeg: string;
    button: string;
    card: string;
  };
}

export interface CompanyDesignConfig {
  tokens: DesignTokens;
  customCSS?: string;
  favicon?: string;
  logo?: string;
}
