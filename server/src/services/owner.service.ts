import { prismaPostgres } from '@/database/prisma';
import { DocumentOwner, Prisma } from '../../node_modules/.prisma/client/postgresql';

export class OwnerService {
    async create(data: Prisma.DocumentOwnerCreateInput): Promise<DocumentOwner> {
        return prismaPostgres.documentOwner.create({
            data,
        });
    }

    async findById(id: string): Promise<DocumentOwner | null> {
        return prismaPostgres.documentOwner.findUnique({
            where: { id_document_owner: id },
        });
    }

    async update(id: string, data: Prisma.DocumentOwnerUpdateInput): Promise<DocumentOwner> {
        return prismaPostgres.documentOwner.update({
            where: { id_document_owner: id },
            data,
        });
    }

    async delete(id: string): Promise<DocumentOwner> {
        return prismaPostgres.documentOwner.delete({
            where: { id_document_owner: id },
        });
    }

    async list({
        filter,
        page = 1,
        limit = 20,
    }: {
        filter?: Prisma.DocumentOwnerWhereInput;
        page?: number;
        limit?: number;
    }) {
        const total = await prismaPostgres.documentOwner.count();
        const documentOwners = await prismaPostgres.documentOwner.findMany({
            where: filter || {},
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            documentOwners,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async initialize() {
        const documentOwnersList = [
            {
                name: 'SOLUMADA',
            },
        ];

        try {
            const count = await prismaPostgres.documentOwner.count();
            if (count > 0) {
                console.log('Owners table already initialized');
                return [];
            }

            const result: DocumentOwner[] = [];

            for (const documentOwner of documentOwnersList) {
                const created = await this.create(documentOwner);
                result.push(created);
            }

            console.log('Default Owners inserted');

            return result;
        } catch (err) {
            return [];
        }
    }
}
