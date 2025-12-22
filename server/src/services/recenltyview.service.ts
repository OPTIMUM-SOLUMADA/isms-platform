import { prismaPostgres } from '@/database/prisma';

export class RecentlyViewedService {
    async getByUser(userId: string) {
        return prismaPostgres.recentlyViewedDocument.findMany({
            where: { id_user: userId },
            orderBy: { viewed_at: 'desc' },
        });
    }

    async markDocumentAsViewed(userId: string, documentId: string) {
        // 1. Check if previously viewed
        const existing = await prismaPostgres.recentlyViewedDocument.findFirst({
            where: { id_user: userId, id_document: documentId },
        });

        if (existing) {
            // 2. Update viewedAt
            await prismaPostgres.recentlyViewedDocument.update({
                where: { id_recently_viewed: existing.id_recently_viewed },
                data: { viewed_at: new Date() },
            });
        } else {
            // 3. Create new history entry
            await prismaPostgres.recentlyViewedDocument.create({
                data: {
                    id_user: userId,
                    id_document: documentId,
                    viewed_at: new Date(),
                },
            });
        }

        // 4. Keep only last 5 entries (optional)
        const oldItems = await prismaPostgres.recentlyViewedDocument.findMany({
            where: { id_user: userId },
            orderBy: { viewed_at: 'desc' },
            skip: 5,
        });

        if (oldItems.length > 0) {
            await prismaPostgres.recentlyViewedDocument.deleteMany({
                where: {
                    id_recently_viewed: { in: oldItems.map((item) => item.id_recently_viewed) },
                },
            });
        }
    }
}
