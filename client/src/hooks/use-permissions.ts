import { useCallback, useMemo } from "react";
import type { AccessPermission, ActionPermission } from "@/types/role";
import { useAuth } from "@/contexts/AuthContext";
import { roleAccessPermissions, roleActionPermissions } from "@/configs/role-permissions";

export const usePermissions = () => {
    const { user } = useAuth();

    const actionPermissions = useMemo(() => {
        if (!user) return [];
        return roleActionPermissions[user.role] || [];
    }, [user]);

    const hasActionPermission = useCallback(
        (permission: ActionPermission) => actionPermissions.includes(permission)
        , [actionPermissions]
    );

    const accessPermissions = useMemo(() => {
        if (!user) return [];
        return roleAccessPermissions[user.role] || [];
    }, [user]);

    const hasAccessPermission = useCallback(
        (permission: AccessPermission) => accessPermissions.includes(permission)
        , [accessPermissions]
    );

    return {
        actionPermissions, hasActionPermission,
        accessPermissions, hasAccessPermission
    };
};
