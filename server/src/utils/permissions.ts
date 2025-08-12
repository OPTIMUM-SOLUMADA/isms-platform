import { RoleType, Permission } from "../types/roles";
import rolePermissionsMap from "../configs/role-permissions";

/**
 * Check if the user's role includes the required permission
 */
export function hasPermission(role: RoleType, permission: Permission): boolean {
    const permissions = rolePermissionsMap[role] ?? [];
    return permissions.includes(permission);
}
