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

    const from = location.state?.from?.pathname || "/dashboard";

    if (isLoading) {
        return <LoadingSplash variant="light" progress={42} />
    }

    if (isAuthenticated && !isLoading) {
        // Redirect authenticated users to dashboard or home
        return <Navigate to={from} state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
