import { prismaPostgres } from '@/database/prisma';
import { Type, Prisma } from '../../node_modules/.prisma/client/postgresql';

const includes: Prisma.TypeInclude = {
    documents: {
        select: {
            id_document: true,
            title: true,
        },
    },
};

/**
 * Service for managing document types
 * Uses PostgreSQL for relational data
 */
export class DocumentTypeService {
    async create(data: Prisma.TypeCreateInput): Promise<Type> {
        return prismaPostgres.type.create({
            data,
            include: includes,
        });
    }

    async findAll(): Promise<Type[]> {
        return prismaPostgres.type.findMany({
            include: includes,
            orderBy: { created_at: 'desc' },
        });
    }

    async findByName(name: string): Promise<Type | null> {
        return prismaPostgres.type.findFirst({
            where: { name },
            include: includes,
        });
    }

    async findById(id: string): Promise<Type | null> {
        return prismaPostgres.type.findUnique({
            where: { id_type: id },
            include: includes,
        });
    }

    async update(id: string, data: Prisma.TypeUpdateInput): Promise<Type> {
        return prismaPostgres.type.update({
            where: { id_type: id },
            data,
            include: includes,
        });
    }

    async delete(id: string): Promise<Type> {
        return prismaPostgres.type.delete({
            where: { id_type: id },
        });
    }

    async list({
        filter,
        page = 1,
        limit = 20,
        orderBy = { created_at: 'desc' },
    }: {
        filter?: Prisma.TypeWhereInput;
        page?: number;
        limit?: number;
        orderBy?: Prisma.TypeOrderByWithRelationInput;
    }) {
        const total = await prismaPostgres.type.count({ where: filter });
        const documentTypes = await prismaPostgres.type.findMany({
            include: includes,
            where: filter || {},
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            documentTypes,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async search(query: string) {
        return prismaPostgres.type.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id_type: true,
                name: true,
                description: true,
            },
        });
    }

    async initialize() {
        const count = await prismaPostgres.type.count();
        if (count > 0) {
            console.log('Types table already initialized');
            return [];
        }

        const documentTypesList = [
            { name: 'Policy', description: '' },
            { name: 'Procedure', description: '' },
            { name: 'Record', description: '' },
        ];

        const result: Type[] = [];

        for (const documentType of documentTypesList) {
            const existing = await this.findByName(documentType.name);
            if (!existing) {
                const created = await this.create({
                    name: documentType.name,
                    description: documentType.description,
                });
                result.push(created);
            }
        }

        console.log('Default Types inserted');

        return result;
    }
}
