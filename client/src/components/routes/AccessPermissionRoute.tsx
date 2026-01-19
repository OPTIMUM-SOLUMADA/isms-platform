import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "@/hooks/use-permissions";
import type { AccessPermission } from "@/types/role";

interface AccessPermissionRouteProps {
    requiredPermission?: AccessPermission;
}

const AccessPermissionRoute: React.FC<AccessPermissionRouteProps> = ({ requiredPermission }) => {
    const { hasAccessPermission } = usePermissions();

    if (requiredPermission && !hasAccessPermission(requiredPermission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // if (requiredPermission)
    //     console.log("Me has perm: ", hasAccessPermission(requiredPermission));

    return <Outlet />;
};

export default AccessPermissionRoute;
