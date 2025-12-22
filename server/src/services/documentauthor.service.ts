import { prismaPostgres } from '@/database/prisma';
import { DocumentAuthor, User } from '../../node_modules/.prisma/client/postgresql';

/**
 * Service for managing document authors
 * Uses PostgreSQL for relational data
 */
export class DocumentAuthorService {
    /**
     * Add one or multiple authors to a document version
     */
    static async addAuthors(documentId: string, versionId: string, userIds: string[]): Promise<DocumentAuthor[]> {
        const data = userIds.map((userId) => ({
            id_document: documentId,
            id_version: versionId,
            id_user: userId,
        }));
        return prismaPostgres.documentAuthor.createMany({ data }).then(async () => {
            // Return the actual records
            return prismaPostgres.documentAuthor.findMany({
                where: { id_document: documentId, id_user: { in: userIds } },
                include: { user: true },
            });
        });
    }

    /**
     * Remove authors from a document version
     */
    static async removeAuthors(documentId: string, versionId: string, userIds: string[]): Promise<number> {
        const result = await prismaPostgres.documentAuthor.deleteMany({
            where: { id_document: documentId, id_version: versionId, id_user: { in: userIds } },
        });
        return result.count;
    }

    /**
     * Get all authors of a document
     */
    static async getAuthors(documentId: string): Promise<User[]> {
        const authors = await prismaPostgres.documentAuthor.findMany({
            where: { id_document: documentId },
            include: { user: true },
        });
        return authors.map((o) => o.user);
    }

    /**
     * Replace all authors of a document version
     */
    static async setAuthors(documentId: string, versionId: string, userIds: string[]): Promise<DocumentAuthor[]> {
        // Remove all existing authors for this version first
        await prismaPostgres.documentAuthor.deleteMany({ 
            where: { id_document: documentId, id_version: versionId } 
        });
        // Add new ones
        return this.addAuthors(documentId, versionId, userIds);
    }
}
