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
  clause: string;
  title: string;
  progress: number;
  status: "compliant" | "partial" | "non-compliant" | "not-started";
  documents: number;
  lastReviewed: string;
  nextReview: string;
  owner: string;
  priority: "high" | "medium" | "low";
};

type DocumentStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "EXPIRED";

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

  categoryId: string;

  createdAt: string;
  updatedAt: string;

  // Relations
  isoClause: ISOClause;
  owners: [{ user: User }];
  reviewers: [{ user: User }];
  type: DocumentType;
  versions: DocumentVersion[];
  reviews: DocumentReview[];
  approvals: DocumentApproval[];
  notifications: Notification[];
  auditlogs: AuditLog[];
};

export type DocumentType = {
  id: string;
  name: string;
  description: string;
  // isoClauseNumber: string;

  createdAt: string;
  updatedAt: string;
};

export type DocumentVersion = {
  id: string;
  documentId: string;
  version: string;
  comment?: string | null;
  createdAt: Date;
  isCurrent: boolean; // optional: flag the latest version

  document: Document;
  approvals?: DocumentApproval[];
};

export type DocumentReview = {
  id: string;
  documentId: string;
  reviewerId: string;
  comment?: string | null;
  isApproved?: boolean | null;
  isCompleted: boolean;
  reviewDate?: Date | null;

  // Relations
  document?: Document;
  reviewer?: User;
};

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

export type AuditLog = {
  id: string;
  userId?: string | null;
  eventType: AuditEventType;
  documentId?: string | null;
  details?: Record<string, any> | null; // Json en Prisma => Record<string, any>
  timestamp: Date;

  // Relations
  user?: User | null;
  document?: Document | null;
};
export type AuditEventType =
  | "DOCUMENT_UPLOAD"
  | "DOCUMENT_UPDATE"
  | "DOCUMENT_VERSION_CREATED"
  | "DOCUMENT_STATUS_CHANGE"
  | "DOCUMENT_REVIEW_SUBMITTED"
  | "USER_ROLE_CHANGE"
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
  department: Department;
  departmentId: string;

  documentOwners: Document[];
  reviews: any[];

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

  createdAt: string;
  updatedAt: string;
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
  description: string;
  code: string;

  documents: Document[];
  createdAt: string;
  updatedAt: string;
}
