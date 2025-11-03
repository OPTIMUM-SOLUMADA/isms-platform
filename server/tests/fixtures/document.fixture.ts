import { Document } from '@prisma/client';
import { user } from './users.fixture';
import { documentType } from './documenttype.fixture';

// Documents mock
export const document: Document = {
    id: 'doc1',
    title: 'Information Security Policy',
    status: 'APPROVED',
    nextReviewDate: new Date('2025-12-15'),
    description: 'Policy for company-wide information security',
    fileUrl: '/uploads/test-file.pdf',
    reviewFrequency: 'DAILY',
    isoClauseId: '',

    published: false,
    publicationDate: null,
    classification: 'CONFIDENTIAL',
    folderId: '',

    ownerId: user.id,
    categoryId: documentType.id,

    createdAt: new Date(),
    updatedAt: new Date(),
};

export const documents = [document, { ...document, id: 'doc2', title: 'Security Policy' }];
