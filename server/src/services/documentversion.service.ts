import prisma from '@/database/prisma';

export class DocumentVersionService {
    async getById(id: string) {
        return prisma.documentVersion.findFirst({
            where: {
                id,
            },
        });
    }
}
