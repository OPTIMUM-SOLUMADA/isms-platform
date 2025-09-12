import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

const userIncludes: Prisma.UserInclude = {
    department: {
        include: {
            members: {
                select: {
                    name: true,
                    email: true,
                    id: true,
                },
            },
        },
    },
    documentReviews: true,
    documentApprovals: true,
    notifications: true,
    auditLogs: true,
    documentOwners: {
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
};
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

    async listUsers(filter?: Prisma.UserWhereInput) {
        return prisma.user.findMany({
            ...(filter ? { where: filter } : {}),
            include: {
                ...userIncludes,
            },
        });
    }
}
