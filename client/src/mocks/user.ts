import type { User } from "@/types";

export const users: User[] = [
    {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@company.com',
        role: 'admin',
        department: 'Information Security',
        status: 'active',
        lastActive: '2025-01-12',
        joinedDate: '2023-01-15',
        permissions: ['manage_all', 'approve_documents', 'manage_users', 'audit_access'],
        documents: 45,
        reviews: 23
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'manager',
        department: 'Risk Management',
        status: 'active',
        lastActive: '2025-01-11',
        joinedDate: '2023-03-10',
        permissions: ['manage_department', 'approve_documents', 'assign_reviews'],
        documents: 32,
        reviews: 18
    },
    {
        id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        role: 'contributor',
        department: 'IT Operations',
        status: 'active',
        lastActive: '2025-01-12',
        joinedDate: '2023-06-20',
        permissions: ['create_documents', 'edit_own', 'submit_reviews'],
        documents: 28,
        reviews: 15
    },
    {
        id: '4',
        name: 'Emma Davis',
        email: 'emma.davis@company.com',
        role: 'reviewer',
        department: 'Compliance',
        status: 'active',
        lastActive: '2025-01-10',
        joinedDate: '2023-08-05',
        permissions: ['review_documents', 'comment_documents', 'view_all'],
        documents: 12,
        reviews: 34
    },
    {
        id: '5',
        name: 'David Wilson',
        email: 'david.wilson@company.com',
        role: 'contributor',
        department: 'Business Continuity',
        status: 'active',
        lastActive: '2025-01-09',
        joinedDate: '2023-09-12',
        permissions: ['create_documents', 'edit_own', 'submit_reviews'],
        documents: 19,
        reviews: 8
    },
    {
        id: '6',
        name: 'Alice Cooper',
        email: 'alice.cooper@company.com',
        role: 'viewer',
        department: 'Legal',
        status: 'inactive',
        lastActive: '2024-12-15',
        joinedDate: '2023-11-01',
        permissions: ['view_documents', 'download_approved'],
        documents: 3,
        reviews: 2
    }
];