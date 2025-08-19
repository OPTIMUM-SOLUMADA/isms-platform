import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/templates/layout/Layout';

// Lazy load pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const DocumentRepositoryPage = lazy(() => import('@/pages/DocumentRepositoryPage'));
const DocumentAddPage = lazy(() => import('@/pages/DocumentAddPage'));
const ReviewWorkflowPage = lazy(() => import('@/pages/ReviewWorkflowPage'));
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'));
const AuditLogPage = lazy(() => import('@/pages/AuditLogPage'));
const ComplianceDashboardPage = lazy(() => import('@/pages/ComplianceDashboardPage'));

import LoginPage from '@/pages/auth/LoginPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { PublicRoute } from './components/routes/PublicRoute';
import "@/i18n/config";


const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    Loading...
  </div>
);

function App() {

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="documents"
          element={
            <Suspense fallback={<Loading />}>
              <DocumentRepositoryPage />
            </Suspense>
          }
        />
        <Route
          path="documents/add"
          element={
            <Suspense fallback={<Loading />}>
              <DocumentAddPage />
            </Suspense>
          }
        />
        <Route
          path="reviews"
          element={
            <Suspense fallback={<Loading />}>
              <ReviewWorkflowPage />
            </Suspense>
          }
        />
        <Route
          path="compliance"
          element={
            <Suspense fallback={<Loading />}>
              <ComplianceDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<Loading />}>
              <UserManagementPage />
            </Suspense>
          }
        />
        <Route
          path="audit"
          element={
            <Suspense fallback={<Loading />}>
              <AuditLogPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;