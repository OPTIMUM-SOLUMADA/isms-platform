import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

export const userIncludes: Prisma.UserInclude = {
    documentReviews: true,
    documentApprovals: true,
    notifications: true,
    auditLogs: true,
    documentAuthors: {
        select: {
            document: {
                select: {
                    title: true,
                    versions: {
                        where: { isCurrent: true },
                        select: {
                            version: true,
                            fileUrl: true,
                        },
                    },
                },
            },
        },
    },
    departmentRoleUsers: {
        select: {
            id: true,
            departmentRole: {
                select: {
                    id: true,
                    name: true,
                    departmentId: true,
                },
            },
        },
    },
};

export type UserPayload = Prisma.UserGetPayload<{ include: typeof userIncludes }>;

/**
 * Service for managing users
 */
export class UserService {
    async createUser(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data,
            include: {
                ...userIncludes,
            },
        });
    }

    async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                ...userIncludes,
            },
        });
    }

    async getUseByIdNoInclude(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id },
            data,
            include: {
                ...userIncludes,
            },
        });
    }

    async activateUser(id: string) {
        return prisma.user.update({
            where: { id },
            data: { isActive: true },
        });
    }

    async deactivateUser(id: string) {
        return prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id },
        });
    }

    async searchUsers(query: string) {
        return prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                lastLogin: true,
            },
            take: 10,
        });
    }

    async listUsers({
        filter,
        page = 1,
        limit = 20,
        orderBy = { createdAt: 'desc' },
    }: {
        filter?: Prisma.UserWhereInput;
        page?: number;
        limit?: number;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }) {
        const total = await prisma.user.count();

        const users = await prisma.user.findMany({
            where: filter || {},
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                lastLogin: true,
                departmentRoleUsers: {
                    select: {
                        id: true,
                        departmentRole: {
                            select: {
                                id: true,
                                name: true,
                                departmentId: true,
                            },
                        },
                    },
                },
            },
        });

        const totalPages = Math.ceil(total / limit);

        return {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async getUsersByIds(ids: string[]) {
        return prisma.user.findMany({
            where: { id: { in: ids } },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
            },
        });
    }

    async getUserRolesStats() {
        const roles = await prisma.user.groupBy({
            by: ['role'],
            _count: {
                role: true,
            },
        });
        const stats: Record<string, number> = {};
        roles.forEach((role) => {
            stats[role.role] = role._count.role;
        });
        return stats;
    }
}
