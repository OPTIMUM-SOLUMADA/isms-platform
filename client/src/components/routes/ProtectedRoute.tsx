import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSplash from '@/components/loading';
import NetworkError from '../NetworkError';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();
    const { isAuthenticated, isLoading, netWorkError } = useAuth();

    if (isLoading) {
        return <LoadingSplash
            variant="light"
            progress={42}
            message="Authenticating…"
            subMessage="Validating ISO system credentials"
            tips={[
                "Checking user permissions…",
                "Loading security controls…",
                "Preparing audit log…",
            ]}
        />
    }

    if (netWorkError) {
        return <NetworkError />;
    }

    if (!isAuthenticated && !isLoading) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}