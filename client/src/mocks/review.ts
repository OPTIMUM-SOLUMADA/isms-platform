import type { ReviewItem } from "@/types";
import { users } from "./user";
import { documents } from "./document";

export const reviewItems: ReviewItem[] = [
    {
        id: '1',
        documentId: 'doc1',
        document: documents[0],
        reviewerId: '1',
        type: 'Policy',
        stage: 'in-review',
        assignee: 'John Smith',
        dueDate: '2025-01-15',
        priority: 'high',
        comment: "comment document 1",
        progress: 75,
        startDate: '2025-01-08', 
        isApproved: true,
        isCompleted:  true,
        reviewer: users[0],
        reviewDate: new Date('2025-01-15')
    },
    {
        id: '2',
        documentId: 'doc2',
        document: documents[1],
        reviewerId: '1',
        type: 'Procedure',
        stage: 'pending',
        assignee: 'Mike Chen',
        dueDate: '2025-01-18',
        priority: 'medium',
        comment: "comment document 2",
        progress: 0,
        startDate: '2025-01-12',
        isApproved: true,
        isCompleted:  true,
        reviewer: users[2],
        reviewDate: new Date('2025-01-15')
    },
    {
        id: '3',
        documentId: 'doc3',
        document: documents[2],
        reviewerId: '1',
        type: 'Framework',
        stage: 'approved',
        assignee: 'Carol Lee',
        dueDate: '2025-01-10',
        priority: 'low',
        comment: "comment document 3",
        progress: 100,
        startDate: '2025-01-03',
        isApproved: true,
        isCompleted:  true,
        reviewer: users[2],
        reviewDate: new Date('2025-01-15')
    },
];