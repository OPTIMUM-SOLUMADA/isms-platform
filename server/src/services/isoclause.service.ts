import prisma from '@/database/prisma'; // adjust path to your prisma client
import { ISOClause, Prisma } from '@prisma/client';

const includes: Prisma.ISOClauseInclude = {
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

export class ISOClauseService {
    async create(data: Prisma.ISOClauseCreateInput): Promise<ISOClause> {
        return prisma.iSOClause.create({
            data,
            include: includes,
        });
    }

    async findAll(): Promise<ISOClause[]> {
        const clauses = await prisma.iSOClause.findMany({
            include: includes,
        });

        const isoClausesList = clauses.sort((a, b) => {
            // take the part after the dot and convert to number
            const aNum = parseInt(a.code.split('.')[1]!, 10);
            const bNum = parseInt(b.code.split('.')[1]!, 10);
            return aNum - bNum;
        });

        return isoClausesList;
    }

    async findByCode(code: string): Promise<ISOClause | null> {
        return prisma.iSOClause.findUnique({
            where: { code },
        });
    }

    async findById(id: string): Promise<ISOClause | null> {
        return prisma.iSOClause.findUnique({
            where: { id },
            include: includes,
        });
    }

    async update(id: string, data: Prisma.ISOClauseUpdateInput): Promise<ISOClause> {
        return prisma.iSOClause.update({
            where: { id },
            data,
            include: includes,
        });
    }

    async delete(id: string): Promise<ISOClause> {
        return prisma.iSOClause.delete({
            where: { id },
            include: includes,
        });
    }

    async list({
        filter,
        page = 1,
        limit = 20,
        orderBy = { createdAt: 'desc' },
    }: {
        filter?: Prisma.ISOClauseWhereInput;
        page?: number;
        limit?: number;
        orderBy?: Prisma.ISOClauseOrderByWithRelationInput;
    }) {
        const total = await prisma.iSOClause.count();
        const iSOClauses = await prisma.iSOClause.findMany({
            include: includes,
            where: filter || {},
            skip: (page - 1) * limit,
            take: limit,
            orderBy,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            iSOClauses,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async search(query: string) {
        return prisma.iSOClause.findMany({
            where: {
                ...(query && {
                    OR: [
                        { code: { contains: query, mode: 'insensitive' } },
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                }),
            },
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
            },
            take: 20,
        });
    }

    async init() {
        const isoClausesList = [
            {
                code: 'A.5',
                title: 'Information Security Policies',
                description: 'Management direction and support for information security',
            },
            {
                code: 'A.6',
                title: 'Organization of Information Security',
                description: 'Internal organization and mobile devices',
            },
            {
                code: 'A.7',
                title: 'Human Resource Security',
                description: 'Prior to employment, during employment and termination',
            },
            {
                code: 'A.8',
                title: 'Asset Management',
                description: 'Responsibility for assets and information classification',
            },
            {
                code: 'A.9',
                title: 'Access Control',
                description: 'Business requirements and user access management',
            },
            { code: 'A.10', title: 'Cryptography', description: 'Cryptographic controls' },
            {
                code: 'A.11',
                title: 'Physical and Environmental Security',
                description: 'Secure areas and equipment protection',
            },
            {
                code: 'A.12',
                title: 'Operations Security',
                description: 'Operational procedures and responsibilities',
            },
            {
                code: 'A.13',
                title: 'Communications Security',
                description: 'Network security management and information transfer',
            },
            {
                code: 'A.14',
                title: 'System Acquisition, Development and Maintenance',
                description: 'Security requirements and secure development',
            },
            {
                code: 'A.15',
                title: 'Supplier Relationships',
                description: 'Information security in supplier relationships',
            },
            {
                code: 'A.16',
                title: 'Information Security Incident Management',
                description: 'Management of information security incidents',
            },
            {
                code: 'A.17',
                title: 'Information Security Aspects of Business Continuity Management',
                description: 'Information security continuity',
            },
            {
                code: 'A.18',
                title: 'Compliance',
                description: 'Compliance with legal requirements and information security review',
            },
        ];

        const result: ISOClause[] = [];

        for (const isoClause of isoClausesList) {
            const existing = await this.findByCode(isoClause.code);
            if (!existing) {
                const created = await this.create({
                    code: isoClause.code,
                    name: isoClause.title,
                    description: isoClause.description,
                });
                result.push(created);
            }
        }

        return result;
    }
}
