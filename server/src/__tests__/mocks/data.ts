import { User } from '@prisma/client';

export const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'l6qWZ@example.com',
    role: 'ADMIN',
    passwordHash: '$2a$12$TdKuhroGhJ/DjVLDAQp2ouUebXx5S8bG0MYLR32uFzmiMPDq6a32m',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    lastLogin: new Date(),
    departmentId: '1',
    metadata: {},
    ssoId: 'none'
};