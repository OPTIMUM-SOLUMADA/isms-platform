import { RoleType, ActionPermission, AccessPermission } from "@/types/role";

// Action Permissions are used for authorization
export const roleActionPermissions: Record<RoleType, ActionPermission[]> = {
    [RoleType.ADMIN]: [
        "document.view",
        "document.create",
        "document.edit",
        "document.delete",
        "document.publish",
        "document.unpublish",
        "document.assignOwner",
        "document.approve",
        "document.uploadVersion",
        "document.download",
        "user.create",
        "user.read",
        "user.invite",
        "user.update",
        "user.delete",
        "audit.view",
        "dashboard.view",
        "report.export",
        "document.review",
        "document.comment",
        "document.acknowledge",
        "document.search",
    ],
    [RoleType.CONTRIBUTOR]: [
        "document.view",
        "document.create",
        "document.edit",
        "document.delete",
        "document.publish",
        "document.unpublish",
        "document.assignOwner",
        "document.approve",
        "document.uploadVersion",
        "document.download",
    ],
    [RoleType.REVIEWER]: [
        "document.review",
        "document.comment",
        "document.approve",
        "document.search",
        "document.download",
    ],
    [RoleType.VIEWER]: [
        "document.view",
        "document.download",
        "document.search",
        "document.acknowledge",
    ],
};


// Access Permissions are used for routing
export const roleAccessPermissions: Record<RoleType, AccessPermission[]> = {
    [RoleType.ADMIN]: [
        "dashboard.page.access",
        "documents.page.access",
        "reviews.page.access",
        "pendingReviews.page.access",
        "compliance.page.access",
        "users.page.access",
        "audit.page.access",
        "settings.page.access",
        "departments.page.access",
        "document-types.page.access",
        "iso-clauses.page.access",
    ],
    [RoleType.CONTRIBUTOR]: [
        "dashboard.page.access",
        "documents.page.access",
        "reviews.page.access",
        "pendingReviews.page.access",
        "compliance.page.access",
        "audit.page.access",
        "settings.page.access"
    ],
    [RoleType.REVIEWER]: [
        "documents.page.access",
        "reviews.page.access",
        "compliance.page.access",
        "settings.page.access"
    ],
    [RoleType.VIEWER]: [
        "documents.page.access",
        "compliance.page.access",
        "settings.page.access"
    ],
};
