import { DocumentReview } from '@prisma/client';

export const review: DocumentReview = {
    id: '68bacbe3ea87ed93cc6fa894',
    isCompleted: false,
    assignedById: '68bacbe3ea87ed93cc6fa894',
    comment: 'comment',
    decision: null,
    createdAt: new Date(),
    documentId: '68bacbe3ea87ed93cc6fa894',
    reviewDate: new Date(),
    reviewerId: '68bacbe3ea87ed93cc6fa894',
    dueDate: null,
    completedAt: null,
    completedById: null,
    documentVersionId: '68bacbe3ea87ed93cc6fa894',
    isNotified: false,
    notifiedAt: null,
};

export const reviews: DocumentReview[] = [
    review,
    {
        ...review,
        id: '68bacbe3ea87ed93cc6fa895',
        isCompleted: true,
        decision: 'APPROVE',
        completedAt: new Date(),
    },
    {
        ...review,
        id: '68bacbe3ea87ed93cc6fa895',
        isCompleted: true,
        decision: 'REJECT',
        completedAt: new Date(),
    },
    { ...review, id: '68bacbe3ea87ed93cc6fa899' },
];
