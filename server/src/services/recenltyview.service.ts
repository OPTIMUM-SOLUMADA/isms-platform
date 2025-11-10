import prisma from '@/database/prisma';

export class RecentlyViewedService {
    async getByUser(userId: string) {
        return prisma.recentlyViewedDocument.findMany({
            where: { userId, document: { published: true } },
            orderBy: { viewedAt: 'desc' },
            include: { document: true },
        });
    }

    async markDocumentAsViewed(userId: string, documentId: string) {
        // 1. Check if previously viewed
        const existing = await prisma.recentlyViewedDocument.findFirst({
            where: { userId, documentId },
        });

        if (existing) {
            // 2. Update viewedAt
            await prisma.recentlyViewedDocument.update({
                where: { id: existing.id },
                data: { viewedAt: new Date() },
            });
        } else {
            // 3. Create new history entry
            await prisma.recentlyViewedDocument.create({
                data: {
                    userId,
                    documentId,
                    viewedAt: new Date(),
                },
            });
        }

        // 4. Keep only last 5 entries (optional)
        const oldItems = await prisma.recentlyViewedDocument.findMany({
            where: { userId },
            orderBy: { viewedAt: 'desc' },
            skip: 5,
        });

        if (oldItems.length > 0) {
            await prisma.recentlyViewedDocument.deleteMany({
                where: {
                    id: { in: oldItems.map((item) => item.id) },
                },
            });
        }
    }
}
