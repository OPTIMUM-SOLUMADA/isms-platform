import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@/styles/index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { ToastProvider } from './components/ui/toast.tsx';
import { Toaster } from './components/ui/toaster.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
        <Toaster />
      </ToastProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
