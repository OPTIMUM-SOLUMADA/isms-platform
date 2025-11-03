import { ISOClause } from '@prisma/client';

export const isoClause: ISOClause = {
    id: '1',
    code: 'A.5',
    name: 'Access control',
    description: 'Mock ISO Clause',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: null,
};

export const isoClauses: ISOClause[] = [
    isoClause,
    {
        ...isoClause,
        code: 'A.6',
        name: 'Access control 2',
        description: 'Mock ISO Clause 2',
        id: '2',
    },
    {
        ...isoClause,
        code: 'A.7',
        name: 'Access control 3',
        description: 'Mock ISO Clause 3',
        id: '3',
    },
];
