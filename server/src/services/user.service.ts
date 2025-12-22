import { prismaPostgres } from '@/database/prisma';
import { Prisma } from '../../node_modules/.prisma/client/postgresql';

export const userIncludes: Prisma.UserInclude = {
    function: {
        include: {
            department: true,
        },
    },
    role: true,
    document_authors: {
        include: {
            document: {
                select: {
                    title: true,
                },
            },
            version: {
                select: {
                    version: true,
                    file_url: true,
                    is_current: true,
                },
            },
        },
    },
    document_reviewers: {
        include: {
            document: {
                select: {
                    title: true,
                    status: true,
                },
            },
            version: {
                select: {
                    version: true,
                    is_current: true,
                },
            },
        },
    },
};

export type UserPayload = Prisma.UserGetPayload<{ include: typeof userIncludes }>;

/**
 * Service for managing users
 * Uses PostgreSQL for relational user data
 */
export class UserService {
    async createUser(data: Prisma.UserCreateInput) {
        return prismaPostgres.user.create({
            data,
            include: {
                ...userIncludes,
            },
        });
    }

    async getUserById(id: string) {
        return prismaPostgres.user.findUnique({
            where: { id_user: id },
            include: {
                ...userIncludes,
            },
        });
    }

    async getUseByIdNoInclude(id: string) {
        return prismaPostgres.user.findUnique({
            where: { id_user: id },
        });
    }

    async findByEmail(email: string) {
        return prismaPostgres.user.findFirst({ where: { email } });
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput) {
        return prismaPostgres.user.update({
            where: { id_user: id },
            data,
            include: {
                ...userIncludes,
            },
        });
    }

    async activateUser(id: string) {
        return prismaPostgres.user.update({
            where: { id_user: id },
            data: { is_active: true },
        });
    }

    async deactivateUser(id: string) {
        return prismaPostgres.user.update({
            where: { id_user: id },
            data: { is_active: false },
        });
    }

    async delete(id: string) {
        return prismaPostgres.user.delete({
            where: { id_user: id },
        });
    }

    async searchUsers(query: string) {
        return prismaPostgres.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id_user: true,
                email: true,
                name: true,
                is_active: true,
                last_login: true,
                role: true,
            },
            take: 10,
        });
    }

    async listUsers({
        filter,
        page = 1,
        limit = 20,
        orderBy = { created_at: 'desc' },
    }: {
        filter?: Prisma.UserWhereInput;
        page?: number;
        limit?: number;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }) {
        const total = await prismaPostgres.user.count({ where: filter });

        const users = await prismaPostgres.user.findMany({
            where: filter || {},
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
            select: {
                id_user: true,
                email: true,
                name: true,
                is_active: true,
                last_login: true,
                role: true,
                function: {
                    select: {
                        id_function: true,
                        name: true,
                        department: {
                            select: {
                                id_department: true,
                                name: true,
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
        return prismaPostgres.user.findMany({
            where: { id_user: { in: ids } },
            select: {
                id_user: true,
                email: true,
                name: true,
                is_active: true,
                role: true,
            },
        });
    }

    async getUserRolesStats() {
        const roles = await prismaPostgres.role.findMany({
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });
        const stats: Record<string, number> = {};
        roles.forEach((role) => {
            stats[role.name] = role._count.users;
        });
        return stats;
    }
}
