import { RoleType, Permission } from "@/types/roles";

const rolePermissionsMap: Record<RoleType, Permission[]> = {
    [RoleType.ADMIN]: [
        "document.create",
        "document.edit",
        "document.delete",
        "document.publish",
        "document.assignOwner",
        "document.approve",
        "document.uploadVersion",
        "user.manage",
        "audit.view",
        "dashboard.view",
        "report.export",
        "document.review",
        "document.comment",
        "document.acknowledge",
        "document.search",
    ],
    [RoleType.CONTRIBUTOR]: [
        "document.create",
        "document.edit",
        "document.uploadVersion",
        "document.comment",
        "document.search",
    ],
    [RoleType.REVIEWER]: [
        "document.review",
        "document.comment",
        "document.approve",
        "document.search",
    ],
    [RoleType.VIEWER]: [
        "document.view",
        "document.download",
        "document.search",
        "document.acknowledge",
    ],
};

export default rolePermissionsMap;
