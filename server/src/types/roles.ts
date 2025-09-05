export enum RoleType {
    ADMIN = 'ADMIN',
    CONTRIBUTOR = 'CONTRIBUTOR',
    REVIEWER = 'REVIEWER',
    VIEWER = 'VIEWER',
}

// Define permission strings
export type Permission =
    | 'document.view'
    | 'document.download'
    | 'document.create'
    | 'document.edit'
    | 'document.delete'
    | 'document.publish'
    | 'document.assignOwner'
    | 'document.approve'
    | 'document.uploadVersion'
    | 'user.manage'
    | 'audit.view'
    | 'dashboard.view'
    | 'report.export'
    | 'document.review'
    | 'document.comment'
    | 'document.acknowledge'
    | 'document.search';
