import { Department, Prisma } from '@prisma/client';
import prisma from '@/database/prisma';
import { UserService } from './user.service';

const depIncludes: Prisma.DepartmentInclude = {
    documents: {
        select: {
            id: true,
            title: true,
            fileUrl: true,
        },
    },
    members: {
        select: {
            id: true,
            role: true,
            department: true,
            createdAt: true,
        },
    },
    createdBy: {
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    },
};

export class DepartmentService {
    protected userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    async createDepartment(data: Prisma.DepartmentCreateInput) {
        return prisma.department.create({ data, include: depIncludes });
    }

    async getDepartmentById(id: string) {
        return prisma.department.findUnique({
            where: { id },
            include: depIncludes,
        });
    }

    async getDepartmentByName(name: string) {
        return prisma.department.findUnique({
            where: { name },
            include: depIncludes,
        });
    }

    async updateDepartment(id: string, data: Prisma.DepartmentUpdateInput) {
        return prisma.department.update({
            where: { id },
            data,
            include: depIncludes,
        });
    }

    async deleteDepartment(id: string) {
        return prisma.department.delete({ where: { id } });
    }

    async listDepartments({
        filter,
        page = 1,
        limit = 20,
        orderBy = { createdAt: 'desc' },
    }: {
        filter?: Prisma.DepartmentWhereInput;
        page?: number;
        limit?: number;
        orderBy?: Prisma.DepartmentOrderByWithRelationInput;
    }) {
        const total = await prisma.department.count();
        const departments = await prisma.department.findMany({
            include: depIncludes,
            where: filter || {},
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            departments,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async search(query: string) {
        return prisma.department.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                description: true,
            },
            take: 20,
        });
    }

    async init() {
        // Add default departments if not exists
        const departments = [
            { name: 'IT', description: 'Information Technology' },
            { name: 'DEV', description: 'Development' },
            { name: 'HR', description: 'Human Resources' },
            { name: 'ROP', description: 'Responsable Operations' },
            { name: 'Internal Audit', description: 'Internal Audit' },
            { name: 'Legal', description: 'Legal' },
        ];

        const results: Department[] = [];

        for (const department of departments) {
            const existing = await this.getDepartmentByName(department.name);

            if (!existing) {
                console.log(`Creating department: ${department.name}`);
                const created = await this.createDepartment({
                    ...department,
                });
                results.push(created);
            }
        }

        return results;
    }
}
