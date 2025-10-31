import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@/styles/index.css';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { ToastProvider } from './components/ui/toast.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <HashRouter>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
        <Toaster />
      </ToastProvider>
    </HashRouter>
  </ErrorBoundary>
);
