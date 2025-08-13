import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PublicRouteProps {
    children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (isAuthenticated) {
        // Redirect authenticated users to dashboard or home
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
