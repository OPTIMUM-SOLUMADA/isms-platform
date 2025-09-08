export const RolesObject = {
    ADMIN: "ADMIN",
    CONTRIBUTOR: "CONTRIBUTOR",
    REVIEWER: "REVIEWER",
    VIEWER: "VIEWER"
} as const;

export const roles = Object.values(RolesObject) as [
    typeof RolesObject.ADMIN,
    typeof RolesObject.CONTRIBUTOR,
    typeof RolesObject.REVIEWER,
    typeof RolesObject.VIEWER
];