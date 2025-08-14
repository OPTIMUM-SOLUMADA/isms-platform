import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSplash from "../loading";

interface PublicRouteProps {
    children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSplash variant="light" progress={42} />
    }

    if (isAuthenticated && !isLoading) {
        // Redirect authenticated users to dashboard or home
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
