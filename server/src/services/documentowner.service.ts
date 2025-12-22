import { DocumentOwner, Prisma } from '../../node_modules/.prisma/client/postgresql';
import { prismaPostgres } from '@/database/prisma';

export class DocumentOwnerService {
    /**
     * Create a new DocumentOwner
     * @param name Owner's name
     */
    async create(name: string): Promise<DocumentOwner> {
        return prismaPostgres.documentOwner.create({
            data: { name },
        });
    }

    /**
     * Find a DocumentOwner by ID
     * @param id Owner ID
     */
    async findById(id: string): Promise<DocumentOwner | null> {
        return prismaPostgres.documentOwner.findUnique({
            where: { id_document_owner: id },
        });
    }

    /**
     * Get all DocumentOwners
     */
    async findAll(): Promise<DocumentOwner[]> {
        return prismaPostgres.documentOwner.findMany();
    }

    /**
     * Update a DocumentOwner's name
     * @param id Owner ID
     * @param name New name
     */
    async updateName(id: string, data: Prisma.DocumentOwnerUpdateInput): Promise<DocumentOwner> {
        return prismaPostgres.documentOwner.update({
            where: { id_document_owner: id },
            data: { ...data },
        });
    }

    /**
     * Delete a DocumentOwner
     * @param id Owner ID
     */
    async delete(id: string): Promise<DocumentOwner> {
        return prismaPostgres.documentOwner.delete({
            where: { id_document_owner: id },
        });
    }

    /**
     * Initialize default values
     * Only adds if table is empty
     */
    async initialize(defaultOwners: string[] = ['SOLUMADA']): Promise<void> {
        const count = await prismaPostgres.documentOwner.count();
        if (count === 0) {
            const createData = defaultOwners.map((name) => ({ name }));
            await prismaPostgres.documentOwner.createMany({
                data: createData,
            });
            console.log('Default DocumentOwners inserted');
        } else {
            console.log('DocumentOwners table already initialized');
        }
    }
}
