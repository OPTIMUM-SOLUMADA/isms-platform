import { prismaPostgres } from '@/database/prisma';
import { Prisma } from '../../node_modules/.prisma/client/postgresql';

export class GoogleAccountService {
    async create(data: Prisma.GoogleAccountCreateInput) {
        await prismaPostgres.googleAccount.deleteMany();
        return prismaPostgres.googleAccount.create({ data });
    }

    async getFirst() {
        return prismaPostgres.googleAccount.findFirst();
    }

    async getLast() {
        return prismaPostgres.googleAccount.findFirst({ orderBy: { created_at: 'desc' } });
    }

    async update(id: string, data: Prisma.GoogleAccountUpdateInput) {
        return prismaPostgres.googleAccount.update({ where: { id_google_account: id }, data });
    }

    async getAll() {
        return prismaPostgres.googleAccount.findMany();
    }

    async deleteAll() {
        return prismaPostgres.googleAccount.deleteMany();
    }
}
