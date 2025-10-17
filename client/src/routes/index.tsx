import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/templates/layout/Layout';

import LoginPage from '@/pages/auth/LoginPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import SettingsPage from '@/pages/SettingsPage';

import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { PublicRoute } from '@/components/routes/PublicRoute';
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import AccessPermissionRoute from "@/components/routes/AccessPermissionRoute";
import NotFoundPage from "@/pages/404";
import { AccessPermission } from "@/types/role";
// import { ReviewWorkflowPage } from "@/pages/documents/DocumentReviewPage";
import { AppProviders } from "@/providers/AppProviders";
import { PageSkeleton } from "@/components/page-skeleton";
import DepartmentPage from "@/pages/departments/DepartmentPage";
import DocumentTypePage from "@/pages/document-types/DocumentTypePage";
import ISOClausePage from "@/pages/ISOClausePage";
import DepartmentDetail from "@/pages/departments/DepartmentDetail";
import VerifyAccountPage from "@/pages/auth/VerifyAccountPage";
import DocumentEditorPage from "@/pages/documents/DocumentEditorPage";
import ReviewApprovalPage from "@/pages/reviews/ReviewApprovalPage";
import PendingReviewsDashboardPage from "@/pages/reviews/PendingReviewsDashboardPage";

// Lazy load pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const DocumentRepositoryPage = lazy(() => import('@/pages/documents/DocumentRepositoryPage'));
const DocumentAddPage = lazy(() => import('@/pages/documents/DocumentAddPage'));
const DocumentEditPage = lazy(() => import('@/pages/documents/DocumentEditPage'));
const DocumentDetail = lazy(() => import('@/pages/documents/DocumentDetailPage'));

// const DepartmentDetail = lazy(() => import('@/pages/departments/DepartmentDetail'));

const ReviewWorkflowPage = lazy(() => import('@/pages/reviews/ReviewWorkflowPage'));
const UserManagementPage = lazy(() => import('@/pages/users/UserManagementPage'));
const AuditLogPage = lazy(() => import('@/pages/AuditLogPage'));
const ComplianceDashboardPage = lazy(() => import('@/pages/ComplianceDashboardPage'));
const UserProfilePage = lazy(() => import('@/pages/users/UserProfilePage'));

interface AppRoute {
    type?: "public" | "protected";
    index?: boolean;
    path?: string;
    element?: JSX.Element;
    permission?: AccessPermission;
    children?: AppRoute[];
    wrapper?: React.ReactNode;
}

const routeConfig: AppRoute[] = [
    { path: "/login", element: <LoginPage />, type: "public" },
    { path: "/forgot-password", element: <ForgotPasswordPage />, type: "public" },
    { path: "/reset-password", element: <ResetPasswordPage />, type: "public" },
    { path: "/verify-account/:token", element: <VerifyAccountPage />, type: "public" },
    {
        path: "/",
        type: "protected",
        element: (
            <ProtectedRoute>
                <AppProviders>
                    <Layout />
                </AppProviders>
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },

            // Dashboard
            {
                path: "dashboard",
                permission: "dashboard.page.access",
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                ],
            },

            // Documents
            {
                path: "documents",
                permission: "documents.page.access",
                children: [
                    { index: true, element: <DocumentRepositoryPage /> },
                    { path: "add", element: <DocumentAddPage /> },
                    { path: "edit/:id", element: <DocumentEditPage /> },
                    { path: "view/:id", element: <DocumentDetail /> },
                    { path: "review/:id", element: <ReviewWorkflowPage /> }
                ],
            },

            // Reviews
            {
                path: "reviews",
                permission: "reviews.page.access",
                children: [
                    { index: true, element: <ReviewWorkflowPage /> },
                    { path: "pending", element: <PendingReviewsDashboardPage />}
                ],
            },

            // Reviews
            {
                path: "pending-reviews",
                permission: "pendingReviews.page.access",
                children: [
                    { index: true, element: <PendingReviewsDashboardPage />}
                ],
            },
            // Compliance
            {
                path: "compliance",
                permission: "compliance.page.access",
                children: [{ index: true, element: <ComplianceDashboardPage /> }],
            },

            // Users
            {
                path: "users",
                permission: "users.page.access",
                children: [
                    {
                        index: true,
                        element: (
                            <UserManagementPage />
                        ),
                    },
                    {
                        path: "view/:id",
                        element: <UserProfilePage />
                    }
                ],
            },

            // Audit
            {
                path: "audit",
                permission: "audit.page.access",
                children: [{ index: true, element: <AuditLogPage /> }],
            },

            {
                path: "settings",
                permission: "settings.page.access",
                children: [{ index: true, element: <SettingsPage /> }],
            },

            // Departments
            {
                path: "departments",
                permission: "documents.page.access",
                children: [
                    { index: true, element: <DepartmentPage /> },
                    { path: "view/:id", element: <DepartmentDetail /> },
                ],
            },
            // Document types
            {
                path: "document-types",
                permission: "documents.page.access",
                children: [{ index: true, element: <DocumentTypePage /> }],
            },
            // ISOClause 
            {
                path: "iso-clauses",
                permission: "documents.page.access",
                children: [{ index: true, element: <ISOClausePage /> }],
            },

            // Document editor page
            {
                path: "document-editor/:documentId/:type",
                permission: "documents.page.access",
                children: [{ index: true, element: <DocumentEditorPage /> }],
            },
            // Document Review Approval
            {
                path: "review-approval/:reviewId",
                permission: "documents.page.access",
                children: [{ index: true, element: <ReviewApprovalPage /> }],
            },
            // Special pages
            { path: "unauthorized", element: <UnauthorizedPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
];


// Recursive renderer
const renderRoutes = (routes: AppRoute[]): React.ReactNode =>
    routes.map(({ path, element, type, permission, wrapper, children, index }) => {
        const WrappedElement = (
            <Suspense fallback={<PageSkeleton />}>{wrapper ?? element}</Suspense>
        );

        let routeElement: React.ReactNode = WrappedElement;
        if (type === "public") routeElement = <PublicRoute>{WrappedElement}</PublicRoute>;
        if (type === "protected") routeElement = <ProtectedRoute>{WrappedElement}</ProtectedRoute>;
        if (permission) routeElement = <AccessPermissionRoute requiredPermission={permission} />;

        // Index route (cannot have children)
        if (index) {
            return (
                <Route
                    key={`index-${Math.random().toString(36).substr(2, 5)}`}
                    index
                    element={routeElement}
                />
            );
        }

        // Normal route (can have children)
        return (
            <Route
                key={path ?? `route-${Math.random().toString(36).substr(2, 5)}`}
                path={path}
                element={routeElement}
            >
                {children && renderRoutes(children)}
            </Route>
        );
    });


export default function AppRoutes() {
    return (
        <Routes>
            {renderRoutes(routeConfig)}
        </Routes>
    );
}
