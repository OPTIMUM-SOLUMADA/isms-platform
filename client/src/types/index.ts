
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
    type: string;
    category: string;
    version: string;
    status: 'draft' | 'review' | 'approved' | 'expired';
    owner: string;
    reviewer: string;
    lastModified: string;
    nextReview: string;
    iso27001Clause: string;
    tags: string[];
}

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
}