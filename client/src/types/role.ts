export enum RoleType {
    ADMIN = "ADMIN",
    CONTRIBUTOR = "CONTRIBUTOR",
    REVIEWER = "REVIEWER",
    VIEWER = "VIEWER",
}

// Define permission strings
export type ActionPermission =
    "document.view"
    | "document.download"
    | "document.create"
    | "document.edit"
    | "document.delete"
    | "document.publish"
    | "document.unpublish"
    | "document.assignOwner"
    | "document.approve"
    | "document.uploadVersion"
    | "user.access"       // can open user page
    | "document.access"   // can open document page
    | "dashboard.access"  // can open dashboard page
    | "audit.access"      // can open audit page
    | "view.access"       // can open view page
    | "user.create"
    | "user.read"
    | "user.update"
    | "user.delete"
    | "user.invite"
    | "audit.view"
    | "dashboard.view"
    | "report.export"
    | "document.review"
    | "document.comment"
    | "document.acknowledge"
    | "document.search";

export type AccessPermission =
    | "dashboard.page.access"
    | "documents.page.access"
    | "reviews.page.access"
    | "pendingReviews.page.access"
    | "compliance.page.access"
    | "users.page.access"
    | "settings.page.access"
    | "audit.page.access"
    | "departments.page.access"
    | "document-types.page.access"
    | "published-document.page.access"
    | "iso-clauses.page.access";
