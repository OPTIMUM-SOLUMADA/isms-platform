import { DocumentOwner, Prisma } from '@prisma/client';
import prisma from '@/database/prisma';

const include: Prisma.DocumentOwnerInclude = {
    documents: {
        select: {
            id: true,
            title: true,
            versions: {
                where: { isCurrent: true },
                select: {
                    version: true,
                    fileUrl: true,
                },
            },
            fileUrl: true,
        },
    },
};

export class DocumentOwnerService {
    /**
     * Create a new DocumentOwner
     * @param name Owner's name
     */
    async create(name: string): Promise<DocumentOwner> {
        return prisma.documentOwner.create({
            data: { name },
        });
    }

    /**
     * Find a DocumentOwner by ID
     * @param id Owner ID
     */
    async findById(id: string): Promise<DocumentOwner | null> {
        return prisma.documentOwner.findUnique({
            where: { id },
            include, // include related documents
        });
    }

    /**
     * Get all DocumentOwners
     */
    async findAll(): Promise<DocumentOwner[]> {
        return prisma.documentOwner.findMany({
            include,
        });
    }

    /**
     * Update a DocumentOwner's name
     * @param id Owner ID
     * @param name New name
     */
    async updateName(id: string, data: Prisma.DocumentOwnerUpdateInput): Promise<DocumentOwner> {
        return prisma.documentOwner.update({
            where: { id },
            data: { ...data },
        });
    }

    /**
     * Delete a DocumentOwner
     * @param id Owner ID
     */
    async delete(id: string): Promise<DocumentOwner> {
        return prisma.documentOwner.delete({
            where: { id },
        });
    }

    /**
     * Initialize default values
     * Only adds if table is empty
     */
    async initialize(defaultOwners: string[] = ['SOLUMADA']): Promise<void> {
        const count = await prisma.documentOwner.count();
        if (count === 0) {
            const createData = defaultOwners.map((name) => ({ name }));
            await prisma.documentOwner.createMany({
                data: createData,
            });
            console.log('Default DocumentOwners inserted');
        } else {
            console.log('DocumentOwners table already initialized');
        }
    }
}
