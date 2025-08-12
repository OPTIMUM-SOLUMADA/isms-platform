import { Request, Response, NextFunction } from "express";
import { RoleType, Permission } from "@/types/roles";
import { hasPermission } from "@/utils/permissions";

/**
 * Middleware factory that requires user to have a specific permission
 */
export function authorize(permission: Permission) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Assume user role is attached to req.user.role (string)
        const userRole = req.user?.role as RoleType | undefined;

        if (!userRole) {
            return res.status(401).json({ error: "Unauthorized: No role assigned" });
        }

        if (!hasPermission(userRole, permission)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }

        return next();
    };
}
