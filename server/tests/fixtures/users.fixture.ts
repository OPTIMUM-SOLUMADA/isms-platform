import { User } from '@prisma/client';

export const user: User = {
    id: '1',
    name: 'John Doe',
    email: 'l6qWZ@example.com',
    role: 'ADMIN',
    passwordHash: '$2a$12$TdKuhroGhJ/DjVLDAQp2ouUebXx5S8bG0MYLR32uFzmiMPDq6a32m',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    lastLogin: new Date(),
    metadata: {},
    passwordResetToken: '',
    createdById: '1',
};

// mock users
export const users = [
    {
        id: '1',
        name: 'John Doe',
        email: 'l6qWZ@example.com',
        role: 'ADMIN',
        passwordHash: '$2a$12$TdKuhroGhJ/DjVLDAQp2ouUebXx5S8bG0MYLR32uFzmiMPDq6a32m',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastLogin: new Date(),
        metadata: {},
        passwordResetToken: '',
        createdById: '1',
    },
    {
        id: '2',
        name: 'John Doe',
        email: 'l6qWZ@example.com',
        role: 'ADMIN',
        passwordHash: '$2a$12$TdKuhroGhJ/DjVLDAQp2ouUebXx5S8bG0MYLR32uFzmiMPDq6a32m',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastLogin: new Date(),
        metadata: {},
        passwordResetToken: '',
        createdById: '1',
    },
];
