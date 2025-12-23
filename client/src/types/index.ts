import { Frequency } from "@/constants/frequency";

export type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceType: "document" | "user" | "system" | "review" | "policy";
  status: "success" | "warning" | "error";
  ipAddress: string;
  userAgent: string;
  details: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
};

export type ComplianceClause = {
  id: string;
  isoClauseId: string;          // correspond à isoClauseId dans Prisma
  ownerId?: string;             // correspond à ownerId dans Prisma
  clause: string;               // nom ou code de la clause (ex: "A.5.1")
  title: string;                // titre descriptif de la clause
  progress: number;             // 0-100
  status: "COMPLIANT" | "NON_COMPLIANT"; // enum du back
  document: Document;            // nombre de documents associés
  lastReviewed?: string;        // Date ISO string
  nextReview?: string;          // Date ISO string
  createdAt: string;            // Date ISO string
  updatedAt: string;            // Date ISO string
  isoClause: ISOClause;
  owner: User | null;
};


type DocumentStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "EXPIRED";
export type DocumentClassification =
  | "CONFIDENTIAL"
  | "PUBLIC"
  | "INTERNAL_USE_ONLY";

export type Document = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl?: string | null;
  status: DocumentStatus;
  nextReviewDate?: string | null;
  reviewFrequency?: Frequency | null;
  isoClauseId: string;
  departmentId: string;
  published: boolean;
  publicationDate?: string | null;
  reviewersId: string[];

  department: Department;

  categoryId: string;
  ownerId: string;
  classification: DocumentClassification;

  createdAt: string;
  updatedAt: string;

  // Relations
  isoClause: ISOClause;
  authors: [{ user: User }];
  owner: DocumentOwner;
  reviewers: [{ user: User }];
  type: DocumentType;
  versions: DocumentVersion[];
  reviews: DocumentReview[];
  approvals: DocumentApproval[];
  notifications: Notification[];
  auditlogs: AuditLog[];
  departmentRoles: [{
    id: string;
    departmentRole: DepartmentRole;
  }]
};

export type DocumentOwner = {
  id: string;
  name: string;
};

export type DocumentType = {
  id: string;
  name: string;
  description: string;

  documents: Document[];

  createdId?: string;
  createdBy?: User;

  createdAt: string;
  updatedAt: string;
};

export type DocumentVersion = {
  id: string;
  documentId: string;
  version: string;
  createdAt: string;
  isCurrent: boolean; // optional: flag the latest version
  fileUrl?: string;
  downloadUrl?: string;
  googleDriveFileId: string;
  draftUrl?: string;
  draftId?: string;
  createdBy: User;

  document: Document;
  approvals?: DocumentApproval[];
  documentReviews: DocumentReview[];
};
export type ReviewDecision = "APPROVE" | "REJECT" | "REQUEST_CHANGES";

export interface DocumentReview {
  id: string;
  documentId: string;
  reviewerId: string;
  assignedById?: string | null;
  comment?: string | null;
  decision?: ReviewDecision | null;
  isCompleted: boolean;
  reviewDate: string | null;
  dueDate: string | null;

  document?: Document;
  reviewer: User;
  assignedBy?: User | null;

  documentVersion?: DocumentVersion;
  documentVersionId: string;

  versions?: DocumentVersion[];

  createdAt?: string;
}

export type DocumentApproval = {
  id: string;
  documentId: string;
  approverId: string;
  versionId: string;
  approvedAt: Date;

  // Relations
  document?: Document;
  version?: DocumentVersion;
  approver?: User;
};

export type AuditTargetType =
  | 'DOCUMENT'
  | 'USER'
  | 'DEPARTMENT'
  | 'VERSION'
  | 'REVIEW'
  | 'APPROVAL'
  | 'COMPLIANCE';
export type AuditStatus = 'SUCCESS' | 'FAILED';

export type AuditTarget = {
  id: string;
  type: AuditTargetType;
}

export type AuditLog = {
  id: string;
  userId?: string | null;
  eventType: AuditEventType;
  details?: Record<string, any> | null; // Json en Prisma => Record<string, any>
  timestamp: string;
  targets: AuditTarget[];
  status: AuditStatus;
  ipAddress?: string;
  userAgent?: string;

  // Relations
  user?: User | null;
};

export type AuditEventType =
  // Auth
  | "AUTH_LOGIN_ATTEMPT"
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  // Document
  | "DOCUMENT_UPDATE"
  | "DOCUMENT_EDIT"
  | "DOCUMENT_CREATE"
  | "DOCUMENT_DELETE"
  | "DOCUMENT_DOWNLOAD"
  // Document version
  | "DOCUMENT_VERSION_CREATED"
  | "DOCUMENT_VERSION_APPROVED"
  | "DOCUMENT_VERSION_REJECTED"
  | "DOCUMENT_STATUS_CHANGE"
  | "DOCUMENT_REVIEW_SUBMITTED"
  | "DOCUMENT_REVIEW_COMPLETED"
  // User
  | "USER_UPDATE"
  | "USER_ADD"
  | "USER_DELETE"
  // Department
  | "DEPARTMENT_CREATE"
  | "DEPARTMENT_UPDATE"
  | "DEPARTMENT_DELETE"
  // Compliance
  | "COMPLIANCE_CREATED"
  | "COMPLIANCE_UPDATED"
  // Action
  | "ACCESS_LOG"
  | "EXPORT_LOGS";

export type ReviewItem = {
  id: string;
  documentId: string;
  document: Document;
  reviewerId: string;
  reviewer: User;
  type: string;
  status: DocumentStatus;
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  comment: string;
  progress: number;
  startDate: string;
  isApproved: boolean;
  isCompleted: boolean;
  reviewDate: Date;
};

export enum RoleType {
  ADMIN = "ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
  REVIEWER = "REVIEWER",
  VIEWER = "VIEWER",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  isActive: boolean;
  lastLogin?: string;

  documentOwners: Document[];
  reviews: any[];

  departmentRoleUsers: {
    id: string;
    departmentRole: DepartmentRole;
  }[];

  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  isoClauseNumber: string;
  documents: Document[];
};

export type Department = {
  id: string;
  name: string;
  description: string;
  members: User[];
  documents: Document[];
  createdId?: string;
  createdBy?: User;

  createdAt: string;
  updatedAt: string;
  roles: DepartmentRole[];
};

export type DepartmentRole = {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  createdBy: User;
  departmentMembers: departmentMember[];
  createdAt: string;
  updatedAt: string;
  departmentRoleDocuments: {
    id: string;
    document: Document;
  }[]
  departmentRoleUsers: {
    id: string;
    user: User;
  }[]
};

export type departmentMember = {
  id: string;
  userId: string;
  departmentId: string;
  roleId: string;
};

export interface CustomFormProps<T> {
  onCancel?: () => void;
  onSubmit: (data: T) => void;
  isPending?: boolean;
  error?: string | null;
}

export interface ISOClause {
  id: string;
  name: string;
  description?: string;
  code: string;

  createdBy?: User;
  createdById?: string;

  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export type DepartmentRoleDocument = {
  id: string;
  documentId: string;
  departmentRoleId: string;

  document: Document;
  departmentRole: DepartmentRole;
}

export type RecentlyViewedDocument = {
  id: string;
  userId: string;
  documentId: string;
  viewedAt: Date;

  document: Document;
  user: User;
}

export type NotificationType =
  // Review notifications
  | "REVIEW_NEEDED"
  | "REVIEW_OVERDUE"
  | "REVIEW_COMPLETED"
  // Document notifications
  | "DOCUMENT_CREATED"
  | "DOCUMENT_UPDATED"
  | "DOCUMENT_APPROVED"
  | "DOCUMENT_PARTIALLY_APPROVED"
  | "DOCUMENT_REJECTED"
  | "DOCUMENT_EXPIRED"
  // Version notifications
  | "VERSION_CREATED"
  | "VERSION_APPROVED"
  | "VERSION_REJECTED"
  // User & invitation notifications
  | "USER_INVITED"
  // Compliance notifications
  | "NONCONFORMITY_CREATED"
  | "ACTION_CREATED";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  documentId?: string | null;
  metadata?: {
    approvedReviewers?: Array<{ id: string; name: string }>;
    pendingReviewers?: Array<{ id: string; name: string }>;
    rejectedBy?: Array<{ id: string; name: string }>;
  };
  createdAt: string;

  user?: User;
  document?: {
    id: string;
    title: string;
    status: DocumentStatus;
  };
}

export type NotificationListResponse = {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}