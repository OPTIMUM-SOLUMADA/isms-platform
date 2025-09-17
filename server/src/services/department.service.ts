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
            name: true,
            email: true,
            id: true,
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

    async listDepartments() {
        return prisma.department.findMany({
            include: depIncludes,
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
