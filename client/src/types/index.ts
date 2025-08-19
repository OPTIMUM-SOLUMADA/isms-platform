
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

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'contributor' | 'reviewer' | 'viewer';
    department: string;
    status: 'active' | 'inactive' | 'pending';
    lastActive: string;
    joinedDate: string;
    permissions: string[];
    documents: number;
    reviews: number;
}

export interface CustomFormProps<T> {
    onCancel?: () => void;
    onSubmit: (data: T) => void;
    isPending?: boolean;
    error?: string | null;
}