
import {
    FileText,
    Clock,
    Users,
    Shield,
} from 'lucide-react';

export const stats = [
    {
        title: 'Total Documents',
        value: '247',
        change: '+12',
        changeType: 'increase' as const,
        icon: FileText,
        color: 'blue'
    },
    {
        title: 'Pending Reviews',
        value: '18',
        change: '-5',
        changeType: 'decrease' as const,
        icon: Clock,
        color: 'amber'
    },
    {
        title: 'Compliance Score',
        value: '94%',
        change: '+2%',
        changeType: 'increase' as const,
        icon: Shield,
        color: 'green'
    },
    {
        title: 'Active Users',
        value: '156',
        change: '+8',
        changeType: 'increase' as const,
        icon: Users,
        color: 'purple'
    }
];

export const upcomingDeadlines = [
    {
        id: 1,
        document: 'Information Classification Policy',
        deadline: '2025-01-15',
        owner: 'Alice Cooper',
        priority: 'high' as const
    },
    {
        id: 2,
        document: 'Vendor Management Procedure',
        deadline: '2025-01-18',
        owner: 'Bob Martinez',
        priority: 'medium' as const
    },
    {
        id: 3,
        document: 'Backup and Recovery Plan',
        deadline: '2025-01-22',
        owner: 'Carol Lee',
        priority: 'low' as const
    }
];

export const complianceProgress = [
    { clause: 'A.5 Information Security Policies', progress: 100 },
    { clause: 'A.6 Organization of Information Security', progress: 95 },
    { clause: 'A.7 Human Resource Security', progress: 88 },
    { clause: 'A.8 Asset Management', progress: 92 },
    { clause: 'A.9 Access Control', progress: 85 },
    { clause: 'A.10 Cryptography', progress: 78 }
];