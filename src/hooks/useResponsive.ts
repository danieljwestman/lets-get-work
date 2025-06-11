
import { useState, useEffect } from 'react';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

const DEFAULT_BREAKPOINTS: BreakpointConfig = {
  mobile: 640,   // sm
  tablet: 768,   // md
  desktop: 1024, // lg
  wide: 1280     // xl
};

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  width: number;
  height: number;
}

export const useResponsive = (breakpoints: BreakpointConfig = DEFAULT_BREAKPOINTS): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    return {
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
      isDesktop: width >= breakpoints.desktop && width < breakpoints.wide,
      isWide: width >= breakpoints.wide,
      width,
      height
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setState({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
        isDesktop: width >= breakpoints.desktop && width < breakpoints.wide,
        isWide: width >= breakpoints.wide,
        width,
        height
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return state;
};

export const useBreakpoint = (breakpoint: keyof BreakpointConfig): boolean => {
  const responsive = useResponsive();
  
  switch (breakpoint) {
    case 'mobile':
      return responsive.isMobile;
    case 'tablet':
      return responsive.isTablet;
    case 'desktop':
      return responsive.isDesktop;
    case 'wide':
      return responsive.isWide;
    default:
      return false;
  }
};

// Enhanced responsive utilities
export const useViewport = () => {
  const responsive = useResponsive();
  
  return {
    ...responsive,
    isSmallScreen: responsive.width < 768,
    isMediumScreen: responsive.width >= 768 && responsive.width < 1024,
    isLargeScreen: responsive.width >= 1024,
    orientation: responsive.width > responsive.height ? 'landscape' : 'portrait'
  };
};

// Media query hook for more specific breakpoints
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};
