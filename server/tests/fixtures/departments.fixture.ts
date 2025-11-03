import { Department, User } from '@prisma/client';

export type DepartmentWithMembers = Department & { members: User[] };

// Departments mock
export const department: DepartmentWithMembers = {
    id: 'd1',
    name: 'Information Security',
    description: '',
    members: [],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    createdById: '1',
};

export const departments: DepartmentWithMembers[] = [
    department,
    { ...department, id: 'd2', name: 'Risk Management' },
    { ...department, id: 'd3', name: 'IT Operations' },
    { ...department, id: 'd4', name: 'Compliance' },
    { ...department, id: 'd5', name: 'Business Continuity' },
    { ...department, id: 'd6', name: 'Legal' },
];
