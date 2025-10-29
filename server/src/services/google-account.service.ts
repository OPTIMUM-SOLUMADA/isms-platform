import prisma from '@/database/prisma';
import { Prisma } from '@prisma/client';

export class GoogleAccountService {
    async create(data: Prisma.GoogleAccountCreateInput) {
        await prisma.googleAccount.deleteMany();
        return prisma.googleAccount.create({ data });
    }

    async getFirst() {
        return prisma.googleAccount.findFirst();
    }

    async getLast() {
        return prisma.googleAccount.findFirst({ orderBy: { createdAt: 'desc' } });
    }

    async update(id: string, data: Prisma.GoogleAccountUpdateInput) {
        return prisma.googleAccount.update({ where: { id }, data });
    }

    async getAll() {
        return prisma.googleAccount.findMany();
    }
}
