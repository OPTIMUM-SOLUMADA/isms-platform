import type { Document } from "@/types";

export const documents: Document[] = [
    {
        id: '1',
        title: 'Information Security Policy',
        type: 'Policy',
        category: 'Security Governance',
        version: '2.1',
        status: 'approved',
        owner: 'John Smith',
        reviewer: 'Sarah Johnson',
        lastModified: '2024-12-15',
        nextReview: '2025-06-15',
        iso27001Clause: 'A.5.1',
        tags: ['security', 'governance', 'mandatory']
    },
    {
        id: '2',
        title: 'Access Control Procedure',
        type: 'Procedure',
        category: 'Access Management',
        version: '1.5',
        status: 'review',
        owner: 'Mike Chen',
        reviewer: 'Emma Davis',
        lastModified: '2024-12-10',
        nextReview: '2025-01-15',
        iso27001Clause: 'A.9.1',
        tags: ['access', 'procedure', 'critical']
    },
    {
        id: '3',
        title: 'Incident Response Plan',
        type: 'Plan',
        category: 'Incident Management',
        version: '3.0',
        status: 'approved',
        owner: 'David Wilson',
        reviewer: 'Alice Cooper',
        lastModified: '2024-12-08',
        nextReview: '2025-03-08',
        iso27001Clause: 'A.16.1',
        tags: ['incident', 'response', 'emergency']
    },
    {
        id: '4',
        title: 'Risk Assessment Framework',
        type: 'Framework',
        category: 'Risk Management',
        version: '1.2',
        status: 'draft',
        owner: 'Carol Lee',
        reviewer: 'Bob Martinez',
        lastModified: '2024-12-05',
        nextReview: '2025-02-05',
        iso27001Clause: 'A.6.1',
        tags: ['risk', 'assessment', 'framework']
    },
    {
        id: '5',
        title: 'Data Classification Guide',
        type: 'Guide',
        category: 'Data Protection',
        version: '2.0',
        status: 'expired',
        owner: 'Emma Davis',
        reviewer: 'John Smith',
        lastModified: '2024-06-01',
        nextReview: '2024-12-01',
        iso27001Clause: 'A.8.2',
        tags: ['data', 'classification', 'guide']
    }
];