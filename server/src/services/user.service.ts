import prisma from "@/database/prisma";
import { Prisma } from "@prisma/client";

export class UserService {
    async createUser(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data,
            include: {
                department: true,
                ownedDocuments: true,
                documentReviews: true,
                documentApprovals: true,
                notifications: true,
                auditLogs: true,
            }
        });
    }

    async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                department: true,
                ownedDocuments: true,
                documentReviews: true,
                documentApprovals: true,
                notifications: true,
                auditLogs: true,
            },
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
                department: true,
                ownedDocuments: true,
                documentReviews: true,
                documentApprovals: true,
                notifications: true,
                auditLogs: true,
            },
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
                department: true
            },
        });
    }
}
