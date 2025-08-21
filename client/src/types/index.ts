
export type AuditEntry = {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    resourceType: 'document' | 'user' | 'system' | 'review' | 'policy';
    status: 'success' | 'warning' | 'error';
    ipAddress: string;
    userAgent: string;
    details: string;
    changes?: {
        field: string;
        oldValue: string;
        newValue: string;
    }[];
}

export type ComplianceClause = {
    id: string;
    clause: string;
    title: string;
    progress: number;
    status: 'compliant' | 'partial' | 'non-compliant' | 'not-started';
    documents: number;
    lastReviewed: string;
    nextReview: string;
    owner: string;
    priority: 'high' | 'medium' | 'low';
}

export type Document = {
    id: string;
    title: string;
    description?: string;
    fileUrl?: string;
    status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'EXPIRED';
    nextReviewDate?: string; // ISO string pour compatibilité API/JSON
    reviewFrequency?: number; // en mois
    owner?: User;
    ownerId?: string;
    category?: Category;
    categoryId?: string;
    versions?: DocumentVersion[];                 // à préciser si tu veux typer DocumentVersion
    reviews?: DocumentReview[];                  // idem pour DocumentReview
    approvals?: DocumentApproval[];                // idem pour DocumentApproval
    notifications?: Notification[];            // idem pour Notification
    auditlogs?: AuditLog[];     // idem pour AuditLog
};

export type DocumentVersion = {
  id :           string  ;
  documentId:    string;
  versionNumber: number;
  comment? :      string | null;
  createdAt :    Date;
  isCurrent  :   boolean; // optional: flag the latest version

  document : Document;
  approvals?: DocumentApproval[]
    
}

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
    document: string;
    type: string;
    stage: 'pending' | 'in-review' | 'approved' | 'rejected';
    assignee: string;
    reviewer: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    comments: number;
    progress: number;
    startDate: string;
}

export enum RoleType {
    ADMIN = "ADMIN",
    // CONTRIBUTOR = "CONTRIBUTOR",
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

    documents: any[];
    reviews: any[];

    createdAt: string;
    updatedAt: string;
}

export type Category = {
    id: string;
    name: string;
    description: string;
    isoClauseNumber: string;
    documents: Document[];
}

export type Department = {
    id: string;
    name: string;
    description: string;
    members: User[];

    createdAt: string;
    updatedAt: string;
}

export interface CustomFormProps<T> {
    onCancel?: () => void;
    onSubmit: (data: T) => void;
    isPending?: boolean;
    error?: string | null;
}