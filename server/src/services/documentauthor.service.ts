import { DocumentAuthor, User } from '@prisma/client';
import prisma from '@/database/prisma';

export class DocumentAuthorService {
    /**
     * Add one or multiple authors to a document
     */
    static async addAuthors(documentId: string, userIds: string[]): Promise<DocumentAuthor[]> {
        const data = userIds.map((userId) => ({
            documentId,
            userId,
        }));
        return prisma.documentAuthor.createMany({ data }).then(async () => {
            // Return the actual records
            return prisma.documentAuthor.findMany({
                where: { documentId, userId: { in: userIds } },
                include: { user: true },
            });
        });
    }

    /**
     * Remove authors from a document
     */
    static async removeAuthors(documentId: string, userIds: string[]): Promise<number> {
        const result = await prisma.documentAuthor.deleteMany({
            where: { documentId, userId: { in: userIds } },
        });
        return result.count;
    }

    /**
     * Get all authors of a document
     */
    static async getAuthors(documentId: string): Promise<User[]> {
        const authors = await prisma.documentAuthor.findMany({
            where: { documentId },
            include: { user: true },
        });
        return authors.map((o) => o.user);
    }

    /**
     * Replace all authors of a document
     */
    static async setAuthors(documentId: string, userIds: string[]): Promise<DocumentAuthor[]> {
        // Remove all existing authors first
        await prisma.documentAuthor.deleteMany({ where: { documentId } });
        // Add new ones
        return this.addAuthors(documentId, userIds);
    }
}
