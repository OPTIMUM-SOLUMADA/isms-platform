
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
    owner?: {
        id: string;
        name?: string;                // si le modèle User a un champ name
    };
    category?: {
        id: string;
        name?: string;                // si le modèle Category a un champ name
    };
    versions?: any[];                 // à préciser si tu veux typer DocumentVersion
    reviews?: any[];                  // idem pour DocumentReview
    approvals?: any[];                // idem pour DocumentApproval
    notifications?: any[];            // idem pour Notification
    auditlogs?: any[];                // idem pour AuditLog
};

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