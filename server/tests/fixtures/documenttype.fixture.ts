import { DocumentType } from '@prisma/client';
import { user } from './users.fixture';

// Categories mock
export const documentType: DocumentType = {
    id: 'c1',
    name: 'Security Governance',
    description: '',
    updatedAt: new Date('2023-01-01'),
    createdAt: new Date('2023-01-01'),
    createdById: user.id,
};
