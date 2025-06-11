
import React, { Suspense, lazy } from 'react';
import { LoadingState } from './LoadingState';

// Lazy load heavy admin components
const ThemeEditor = lazy(() => import('../ThemeEditor').then(module => ({ default: module.ThemeEditor })));
const OpportunityEditor = lazy(() => import('../OpportunityEditor').then(module => ({ default: module.OpportunityEditor })));
const ThemeTranslations = lazy(() => import('../ThemeTranslations').then(module => ({ default: module.ThemeTranslations })));

// Wrapper components with Suspense
export const LazyThemeEditor: React.FC<{
  themeId?: string | null;
  onBack: () => void;
  isCreating?: boolean;
}> = (props) => (
  <Suspense fallback={<LoadingState message="Loading theme editor..." />}>
    <ThemeEditor {...props} />
  </Suspense>
);

export const LazyOpportunityEditor: React.FC<{
  opportunityId?: string | null;
  onBack: () => void;
  isCreating?: boolean;
}> = (props) => (
  <Suspense fallback={<LoadingState message="Loading opportunity editor..." />}>
    <OpportunityEditor {...props} />
  </Suspense>
);

export const LazyThemeTranslations: React.FC<{
  themeId: string;
}> = (props) => (
  <Suspense fallback={<LoadingState message="Loading translations..." />}>
    <ThemeTranslations {...props} />
  </Suspense>
);
