/* eslint-disable no-restricted-imports */
/**
 * Re-exports for Prisma types from both PostgreSQL and MongoDB schemas
 * This provides a centralized location for all database types
 */

// PostgreSQL types (main relational data)
export type {
    Department,
    Role,
    Classification,
    ReviewFrequency,
    Type,
    Function,
    IsoClause,
    NonConformityStatus,
    NonConformityType,
    ActionStatus,
    ClauseComplianceRisk,
    ClauseComplianceStatus,
    User,
    Document,
    Version,
    NonConformity,
    CorrectiveAction,
    ClauseCompliance,
    DocumentReviewer,
    DocumentAuthor,
    DepartmentDocumentClassification,
    DocumentClause,
    DocumentNonConformity,
    Prisma as PostgresPrisma,
} from '../../node_modules/.prisma/client/postgresql';

// MongoDB types (audit logs and notifications)
export type {
    AuditLog,
    AuditTarget,
    Notification,
    Prisma as MongoPrisma,
} from '../../node_modules/.prisma/client/mongodb';

// MongoDB enums
export {
    AuditEventType,
    AuditStatus,
    AuditTargetType,
    NotificationType,
} from '../../node_modules/.prisma/client/mongodb';
