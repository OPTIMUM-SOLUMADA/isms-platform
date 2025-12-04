import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

export class NotificationService {
    async create(data: Prisma.NotificationCreateInput) {
        return prisma.notification.create({ data });
    }

    async list({ filter = {}, page = 1, limit = 20 }: { filter?: any; page?: number; limit?: number }) {
        const where = filter || {};
        const total = await prisma.notification.count({ where });
        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { notifications, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async findById(id: string) {
        return prisma.notification.findUnique({ where: { id } });
    }

    async markRead(id: string) {
        return prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } });
    }

    async markAllRead(userId: string) {
        return prisma.notification.updateMany({ where: { userId }, data: { isRead: true, readAt: new Date() } });
    }

    async delete(id: string) {
        return prisma.notification.delete({ where: { id } });
    }
}

export default new NotificationService();
