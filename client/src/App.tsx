
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/templates/layout/Layout';
import DashboardPage from '@/pages/DashboardPage';
import DocumentRepositoryPage from '@/pages/DocumentRepositoryPage';
import ReviewWorkflowPage from '@/pages/ReviewWorkflowPage';
import UserManagementPage from '@/pages/UserManagementPage';
import AuditLogPage from '@/pages/AuditLogPage';
import ComplianceDashboardPage from '@/pages/ComplianceDashboardPage';
import LoginPage from '@/pages/auth/LoginPage';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { PublicRoute } from './components/routes/PublicRoute';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import "@/i18n/config";

export type PageType = 'dashboard' | 'documents' | 'reviews' | 'users' | 'audit' | 'compliance';

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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentRepositoryPage />} />
        <Route path="/reviews" element={<ReviewWorkflowPage />} />
        <Route path="/compliance" element={<ComplianceDashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/audit" element={<AuditLogPage />} />
      </Route>
    </Routes>
  );
}

export default App;