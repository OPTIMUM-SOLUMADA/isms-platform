import { DocumentOwner, User } from '@prisma/client';
import prisma from '@/database/prisma';

export class DocumentOwnerService {
    /**
     * Add one or multiple owners to a document
     */
    static async addOwners(documentId: string, userIds: string[]): Promise<DocumentOwner[]> {
        const data = userIds.map((userId) => ({
            documentId,
            userId,
        }));
        return prisma.documentOwner.createMany({ data }).then(async () => {
            // Return the actual records
            return prisma.documentOwner.findMany({
                where: { documentId, userId: { in: userIds } },
                include: { user: true },
            });
        });
    }

    /**
     * Remove owners from a document
     */
    static async removeOwners(documentId: string, userIds: string[]): Promise<number> {
        const result = await prisma.documentOwner.deleteMany({
            where: { documentId, userId: { in: userIds } },
        });
        return result.count;
    }

    /**
     * Get all owners of a document
     */
    static async getOwners(documentId: string): Promise<User[]> {
        const owners = await prisma.documentOwner.findMany({
            where: { documentId },
            include: { user: true },
        });
        return owners.map((o) => o.user);
    }

    /**
     * Replace all owners of a document
     */
    static async setOwners(documentId: string, userIds: string[]): Promise<DocumentOwner[]> {
        // Remove all existing owners first
        await prisma.documentOwner.deleteMany({ where: { documentId } });
        // Add new ones
        return this.addOwners(documentId, userIds);
    }
}
