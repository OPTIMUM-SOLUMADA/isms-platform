import prisma from '@/database/prisma'; // adjust path to your prisma client
import { DocumentType, Prisma } from '@prisma/client';

const includes: Prisma.DocumentTypeInclude = {
    documents: {
        select: {
            id: true,
            title: true,
            fileUrl: true,
        },
    },
    createdBy: {
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    },
};

export class DocumentTypeService {
    async create(data: Prisma.DocumentTypeCreateInput): Promise<DocumentType> {
        return prisma.documentType.create({
            data,
            include: includes,
        });
    }

    async findAll(): Promise<DocumentType[]> {
        return prisma.documentType.findMany({
            include: includes,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByName(name: string): Promise<DocumentType | null> {
        return prisma.documentType.findUnique({
            where: { name },
            include: includes,
        });
    }

    async findById(id: string): Promise<DocumentType | null> {
        return prisma.documentType.findUnique({
            where: { id },
            include: includes,
        });
    }

    async update(id: string, data: Prisma.DocumentTypeUpdateInput): Promise<DocumentType> {
        return prisma.documentType.update({
            where: { id },
            data,
            include: includes,
        });
    }

    async delete(id: string): Promise<DocumentType> {
        return prisma.documentType.delete({
            where: { id },
        });
    }

    async init() {
        const documentTypesList = [
            { name: 'Policy', description: '' },
            { name: 'Procedure', description: '' },
            { name: 'Plan', description: '' },
            { name: 'Guide', description: '' },
            { name: 'Framework', description: '' },
        ];

        const result: DocumentType[] = [];

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

        return result;
    }
}
