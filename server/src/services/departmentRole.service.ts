import { prismaPostgres } from '@/database/prisma';
import { Prisma } from '../../node_modules/.prisma/client/postgresql';

const include: Prisma.DepartmentRoleInclude = {
    department_role_users: {
        select: {
            id_department_role_user: true,
            id_user: true,
        },
    },
    department_role_documents: {
        select: {
            id_department_role_document: true,
            id_document: true,
        },
    },
};

export class DepartmentRoleService {
    async addRoles(data: Prisma.DepartmentRoleCreateInput) {
        console.log(data);
        return prismaPostgres.departmentRole.create({
            data,
        });
    }

    async findAll() {
        return prismaPostgres.departmentRole.findMany({
            include,
        });
    }

    async getRole(id: string) {
        return prismaPostgres.departmentRole.findUnique({
            where: { id_department_role: id },
            include,
        });
    }

    async listDepartmentsRole({ id, page, limit }: { id: string; page: number; limit: number }) {
        return prismaPostgres.departmentRole.findMany({
            where: { id_department: id },
            include,
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async findById(id: string) {
        return prismaPostgres.departmentRole.findUnique({
            where: { id_department_role: id },
            include,
        });
    }

    async updateRoles(id: string, data: { name?: string; description?: string }) {
        const updateData: any = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;

        return prismaPostgres.departmentRole.update({
            where: { id_department_role: id },
            data: updateData,
        });
    }

    async removeRoles(id: string) {
        return prismaPostgres.departmentRole.delete({ where: { id_department_role: id } });
    }

    async list({
        filter,
        page = 1,
        limit = 20,
        orderBy = { created_at: 'desc' },
    }: {
        filter?: Prisma.DepartmentRoleWhereInput;
        page?: number;
        limit?: number;
        orderBy?: Prisma.DepartmentRoleOrderByWithRelationInput;
    }) {
        const total = await prismaPostgres.departmentRole.count();

        const departmentRoles = await prismaPostgres.departmentRole.findMany({
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
