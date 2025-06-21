
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OpportunityProvider } from '@/contexts/OpportunityContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { DebugPanel } from '@/components/shared/DebugPanel';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import HelpSupport from '@/pages/HelpSupport';
import Marketing from '@/pages/Marketing';
import OpportunityPresentation from '@/pages/OpportunityPresentation';
import NotFound from '@/pages/NotFound';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { DomainRouterService } from '@/services/domainRouterService';
import { useDomainContext } from '@/hooks/useDomainContext';

// Create QueryClient outside of component to prevent recreation on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const DomainAwareRouter: React.FC = () => {
  const navigate = useNavigate();
  const domainInfo = useDomainContext();

  useEffect(() => {
    if (domainInfo) {
      // Redirect subdomain dashboard access to main domain
      if (DomainRouterService.shouldRedirectToDashboard(domainInfo, window.location.pathname)) {
        window.location.href = DomainRouterService.getDashboardUrl();
        return;
      }
    }
  }, [domainInfo, navigate]);

  // Check if this is the main domain or a profile domain
  const isMainDomain = domainInfo?.isMainDomain;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Routes>
        {isMainDomain ? (
          // Main domain routes
          <>
            <Route path="/" element={<Marketing />} />
            <Route path="/opportunities/:profileId" element={<OpportunityPresentation />} />
            <Route path="/opportunities/:profileId/:opportunityId" element={<OpportunityPresentation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          // Profile domain routes (subdomains and custom profile domains)
          <>
            <Route path="/" element={<Index />} />
            <Route path="/:opportunityId" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <OpportunityProvider>
              <LanguageProvider>
                <DomainAwareRouter />
                <Toaster />
                <DebugPanel />
              </LanguageProvider>
            </OpportunityProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
