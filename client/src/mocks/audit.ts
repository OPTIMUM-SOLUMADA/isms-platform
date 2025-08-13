import type { AuditEntry } from "@/types";

export const auditEntries: AuditEntry[] = [
    {
        id: '1',
        timestamp: '2025-01-12T14:30:00Z',
        user: 'John Smith',
        action: 'Document Approved',
        resource: 'Information Security Policy v2.1',
        resourceType: 'document',
        status: 'success',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Document approved after review process completion',
        changes: [
            { field: 'status', oldValue: 'in-review', newValue: 'approved' },
            { field: 'approver', oldValue: '', newValue: 'John Smith' }
        ]
    },
    {
        id: '2',
        timestamp: '2025-01-12T13:45:00Z',
        user: 'Sarah Johnson',
        action: 'Document Modified',
        resource: 'Access Control Procedure v1.5',
        resourceType: 'document',
        status: 'success',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        details: 'Updated access control requirements section',
        changes: [
            { field: 'version', oldValue: '1.4', newValue: '1.5' },
            { field: 'lastModified', oldValue: '2025-01-10', newValue: '2025-01-12' }
        ]
    },
    {
        id: '3',
        timestamp: '2025-01-12T12:15:00Z',
        user: 'Mike Chen',
        action: 'User Login',
        resource: 'System Authentication',
        resourceType: 'system',
        status: 'success',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Successful login to ISMS system'
    },
    {
        id: '4',
        timestamp: '2025-01-12T11:30:00Z',
        user: 'Emma Davis',
        action: 'Review Started',
        resource: 'Risk Assessment Framework v1.2',
        resourceType: 'review',
        status: 'success',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Initiated review process for risk assessment framework',
        changes: [
            { field: 'reviewStatus', oldValue: 'pending', newValue: 'in-review' },
            { field: 'reviewer', oldValue: '', newValue: 'Emma Davis' }
        ]
    },
    {
        id: '5',
        timestamp: '2025-01-12T10:45:00Z',
        user: 'System',
        action: 'Failed Login Attempt',
        resource: 'System Authentication',
        resourceType: 'system',
        status: 'warning',
        ipAddress: '203.0.113.123',
        userAgent: 'Unknown',
        details: 'Multiple failed login attempts detected from external IP'
    },
    {
        id: '6',
        timestamp: '2025-01-12T09:20:00Z',
        user: 'David Wilson',
        action: 'Document Created',
        resource: 'Business Continuity Plan v2.0',
        resourceType: 'document',
        status: 'success',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        details: 'New business continuity plan document created',
        changes: [
            { field: 'status', oldValue: '', newValue: 'draft' },
            { field: 'owner', oldValue: '', newValue: 'David Wilson' }
        ]
    },
    {
        id: '7',
        timestamp: '2025-01-12T08:30:00Z',
        user: 'Alice Cooper',
        action: 'User Permissions Updated',
        resource: 'Bob Martinez',
        resourceType: 'user',
        status: 'success',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Updated user permissions for document management',
        changes: [
            { field: 'role', oldValue: 'viewer', newValue: 'contributor' },
            { field: 'permissions', oldValue: 'view_documents', newValue: 'view_documents,create_documents' }
        ]
    }
];
