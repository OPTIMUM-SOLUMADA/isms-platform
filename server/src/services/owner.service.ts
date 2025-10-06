import prisma from '@/database/prisma'; // adjust path to your prisma client
import { DocumentOwner, Prisma } from '@prisma/client';

const includes: Prisma.DocumentOwnerInclude = {
    documents: {
        select: {
            id: true,
            title: true,
            fileUrl: true,
        },
    },
};

export class OwnerService {
    async create(data: Prisma.DocumentOwnerCreateInput): Promise<DocumentOwner> {
        return prisma.documentOwner.create({
            data,
            include: includes,
        });
    }

    async findById(id: string): Promise<DocumentOwner | null> {
        return prisma.documentOwner.findUnique({
            where: { id },
            include: includes,
        });
    }

    async update(id: string, data: Prisma.DocumentOwnerUpdateInput): Promise<DocumentOwner> {
        return prisma.documentOwner.update({
            where: { id },
            data,
            include: includes,
        });
    }

    async delete(id: string): Promise<DocumentOwner> {
        return prisma.documentOwner.delete({
            where: { id },
            include: includes,
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
        const total = await prisma.documentOwner.count();
        const documentOwners = await prisma.documentOwner.findMany({
            include: includes,
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
            const count = await prisma.documentOwner.count();
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
