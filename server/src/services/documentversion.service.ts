import { prismaPostgres } from '@/database/prisma';
import { Prisma } from '../../node_modules/.prisma/client/postgresql';

/**
 * Service for managing document versions
 * Uses PostgreSQL for relational data
 */
export class DocumentVersionService {
    async getById(id: string) {
        return prismaPostgres.version.findFirst({
            where: {
                id_version: id,
            },
            include: {
                document: {
                    select: {
                        id_document: true,
                        title: true,
                        document_authors: {
                            select: {
                                user: {
                                    select: {
                                        id_user: true,
                                        name: true,
                                        email: true,
                                        created_at: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                        document_reviewers: {
                            select: {
                                user: {
                                    select: {
                                        id_user: true,
                                        name: true,
                                        email: true,
                                        created_at: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async getByDocumentId(documentId: string) {
        return prismaPostgres.version.findMany({
            where: {
                id_document: documentId,
            },
            orderBy: { created_at: 'desc' },
            include: {
                document: {
                    select: {
                        id_document: true,
                        title: true,
                        document_authors: {
                            select: {
                                user: {
                                    select: {
                                        id_user: true,
                                        name: true,
                                        email: true,
                                        created_at: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                        document_reviewers: {
                            select: {
                                user: {
                                    select: {
                                        id_user: true,
                                        name: true,
                                        email: true,
                                        created_at: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                    },
                },
                document_reviewers: true,
            },
        });
    }

    async create(data: Prisma.VersionCreateInput) {
        return prismaPostgres.version.create({ data });
    }

    async update(id: string, data: Prisma.VersionUpdateInput) {
        return prismaPostgres.version.update({ where: { id_version: id }, data });
    }

    async getCurrentVersionByDocumentId(documentId: string) {
        return prismaPostgres.version.findFirst({
            where: { id_document: documentId, is_current: true },
            include: {
                document: {
                    select: {
                        id_document: true,
                        title: true,
                        document_authors: {
                            select: {
                                user: {
                                    select: {
                                        id_user: true,
                                        name: true,
                                        email: true,
                                        created_at: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                        document_reviewers: {
                            select: {
                                user: {
                                    select: {
                                        id_user: true,
                                        name: true,
                                        email: true,
                                        created_at: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    // patch version
    async createPatchedVersion(
        documentId: string,
        data: {
            version: string;
            fileUrl?: string;
            comment?: string;
        },
    ) {
        return prismaPostgres.$transaction(async (tx) => {
            // set current to false for all version of the doc
            await tx.version.updateMany({
                where: { id_document: documentId },
                data: { is_current: false },
            });

            // create the new version
            return await tx.version.create({
                data: {
                    document: { connect: { id_document: documentId } },
                    is_current: true,
                    version: data.version,
                    ...(data.fileUrl && { file_url: data.fileUrl }),
                    ...(data.comment && { comment: data.comment }),
                },
            });
        });
    }
}
