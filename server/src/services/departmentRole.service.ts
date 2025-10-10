import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

const include: Prisma.DepartmentRoleInclude = {
    createdBy: {
        select: {
            id: true,
            name: true,
            role: true,
            createdAt: true,
            email: true,
        },
    },
};

export class DepartmentRoleService {
    async addRoles(data: Prisma.DepartmentRoleCreateInput) {
        console.log(data);
        return prisma.departmentRole.create({
            data,
        });
    }

    async findAll() {
        return prisma.departmentRole.findMany({
            include: { department: true },
        });
    }

    async listDepartmentsRole({ id, page, limit }: { id: string; page: number; limit: number }) {
        return prisma.departmentRole.findMany({
            where: { departmentId: id },
            include: { department: true },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async findById(id: string) {
        return prisma.departmentRole.findUnique({
            where: { id },
            include: { department: true },
        });
    }

    async updateRoles(id: string, data: { name?: string; description?: string }) {
        const updateData: any = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;

        return prisma.departmentRole.update({
            where: { id },
            data: updateData,
        });
    }

    async removeRoles(id: string) {
        return prisma.departmentRole.delete({ where: { id } });
    }

    async list({
        filter,
        page = 1,
        limit = 20,
        orderBy = { createdAt: 'desc' },
    }: {
        filter?: Prisma.DepartmentRoleWhereInput;
        page?: number;
        limit?: number;
        orderBy?: Prisma.DepartmentRoleOrderByWithRelationInput;
    }) {
        const total = await prisma.departmentRole.count();

        const departmentRoles = await prisma.departmentRole.findMany({
            where: filter || {},
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
            include,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            departmentRoles,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }
}
