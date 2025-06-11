
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OpportunityProvider } from '@/contexts/OpportunityContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { DebugPanel } from '@/components/shared/DebugPanel';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import HelpSupport from '@/pages/HelpSupport';
import NotFound from '@/pages/NotFound';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

// Create QueryClient outside of component to prevent recreation on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <OpportunityProvider>
              <LanguageProvider>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/help-support" element={<HelpSupport />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
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
