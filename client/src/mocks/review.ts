import type { ReviewItem } from "@/types";

export const reviewItems: ReviewItem[] = [
    {
        id: '1',
        document: 'Information Security Policy v2.2',
        type: 'Policy',
        stage: 'in-review',
        assignee: 'John Smith',
        reviewer: 'Sarah Johnson',
        dueDate: '2025-01-15',
        priority: 'high',
        comments: 3,
        progress: 75,
        startDate: '2025-01-08'
    },
    {
        id: '2',
        document: 'Access Control Procedure v1.6',
        type: 'Procedure',
        stage: 'pending',
        assignee: 'Mike Chen',
        reviewer: 'Emma Davis',
        dueDate: '2025-01-18',
        priority: 'medium',
        comments: 0,
        progress: 0,
        startDate: '2025-01-12'
    },
    {
        id: '3',
        document: 'Risk Assessment Framework v1.3',
        type: 'Framework',
        stage: 'approved',
        assignee: 'Carol Lee',
        reviewer: 'Bob Martinez',
        dueDate: '2025-01-10',
        priority: 'low',
        comments: 5,
        progress: 100,
        startDate: '2025-01-03'
    },
    {
        id: '4',
        document: 'Business Continuity Plan v2.0',
        type: 'Plan',
        stage: 'rejected',
        assignee: 'David Wilson',
        reviewer: 'Alice Cooper',
        dueDate: '2025-01-12',
        priority: 'high',
        comments: 8,
        progress: 60,
        startDate: '2025-01-05'
    }
];