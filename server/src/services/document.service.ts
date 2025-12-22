/* eslint-disable no-restricted-imports */
import {
    Prisma,
    DocumentStatus,
    ReviewDecision,
    ReviewFrequency,
} from '../../node_modules/.prisma/client/postgresql';
import type { DocumentReview } from '../../node_modules/.prisma/client/postgresql';
import { prismaPostgres } from '@/database/prisma';
import { UserService } from './user.service';
import { DocumentAuthorService } from './documentauthor.service';

const includes: Prisma.DocumentInclude = {
    versions: true,
    type: true,
    review_frequency: true,
    document_authors: {
        include: {
            user: {
                select: {
                    id_user: true,
                    name: true,
                    email: true,
                    role: true,
                    created_at: true,
                },
            },
        },
    },
    document_reviewers: {
        include: {
            user: {
                select: {
                    id_user: true,
                    name: true,
                    email: true,
                    role: true,
                    created_at: true,
                },
            },
        },
    },
    document_clauses: {
        include: {
            iso_clause: true,
        },
    },
    department_document_classifications: {
        include: {
            department: true,
            classification: true,
        },
    },
};

export type DocumentPayload = Prisma.DocumentGetPayload<{ include: typeof includes }>;

export class DocumentService {
    protected userService: UserService;
    protected documentAuthorService: DocumentAuthorService;
    protected documentInclude: Prisma.DocumentInclude;
    constructor() {
        this.userService = new UserService();
        this.documentAuthorService = new DocumentAuthorService();
        this.documentInclude = includes;
    }

    async createDocument(data: Prisma.DocumentCreateInput) {
        const next_review_date = new Date();

        return prismaPostgres.document.create({
            data: {
                ...data,
                next_review_date,
            },
            include: this.documentInclude,
        });
    }

    async linkDocumentToUsers({
        documentId,
        versionId,
        reviewerIds,
        authors,
    }: {
        documentId: string;
        versionId: string;
        reviewerIds: string[];
        authors: string[];
    }) {
        if (!authors.length && !reviewerIds.length) return;

        await prismaPostgres.$transaction([
            prismaPostgres.documentAuthor.createMany({
                data: authors.map((userId) => ({ id_document: documentId, id_user: userId, id_version: versionId })),
            }),
            prismaPostgres.documentReviewer.createMany({
                data: reviewerIds.map((userId) => ({ id_document: documentId, id_user: userId, id_version: versionId, is_approuved: false })),
            }),
        ]);
    }
    async reLinkDocumentToUsers({
        documentId,
        versionId,
        reviewerIds,
        authors,
    }: {
        documentId: string;
        versionId: string;
        reviewerIds: string[];
        authors: string[];
    }) {
        // Delete old links
        await prismaPostgres.$transaction([
            prismaPostgres.documentAuthor.deleteMany({ where: { id_document: documentId } }),
            prismaPostgres.documentReviewer.deleteMany({ where: { id_document: documentId } }),
        ]);

        if (!authors.length && !reviewerIds.length) return;

        await prismaPostgres.$transaction([
            prismaPostgres.documentAuthor.createMany({
                data: authors.map((userId) => ({ id_document: documentId, id_user: userId, id_version: versionId })),
            }),
            prismaPostgres.documentReviewer.createMany({
                data: reviewerIds.map((userId) => ({ id_document: documentId, id_user: userId, id_version: versionId, is_approuved: false })),
            }),
        ]);
    }

    async update(id: string, data: Prisma.DocumentUpdateInput) {
        return prismaPostgres.document.update({
            where: { id_document: id },
            data,
            include: this.documentInclude,
        });
    }

    async updateDocumentWithDetails(
        id: string,
        versionId: string,
        data: Prisma.DocumentUpdateInput,
        ownerIds: string[],
        reviewerIds: string[],
    ) {
        return prismaPostgres.$transaction(async (tx) => {
            // Update the document fields
            const doc = await tx.document.update({
                where: { id_document: id },
                data,
            });

            // Replace owners (delete old, insert new)
            await tx.documentAuthor.deleteMany({ where: { id_document: id } });
            const ownersData = ownerIds.map((userId) => ({
                id_document: id,
                id_user: userId,
                id_version: versionId,
            }));
            if (ownersData.length) {
                await tx.documentAuthor.createMany({ data: ownersData });
            }

            // Remove reviewers (delete old, insert new)
            await tx.documentReviewer.deleteMany({ where: { id_document: id } });
            const reviewersData = reviewerIds.map((userId) => ({
                id_document: id,
                id_user: userId,
                id_version: versionId,
                is_approuved: false,
            }));
            if (reviewersData.length) {
                await tx.documentReviewer.createMany({ data: reviewersData });
            }

            // Return the updated document with owners
            return tx.document.findUnique({
                where: { id_document: doc.id_document },
                include: this.documentInclude,
            });
        });
    }

    async getDocumentById(id: string) {
        return prismaPostgres.document.findUnique({
            where: { id_document: id },
            include: this.documentInclude,
        });
    }

    async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
        return prismaPostgres.document.update({
            where: { id_document: id },
            data,
            include: this.documentInclude,
        });
    }

    async deleteDocument(id: string) {
        // Delete any department document classifications referencing this document
        await prismaPostgres.departmentDocumentClassification.deleteMany({
            where: { id_document: id },
        });
        return prismaPostgres.document.delete({
            where: { id_document: id },
            include: this.documentInclude,
        });
    }

    async listDocuments({ page = 1, limit = 50 }: { page: number; limit: number }) {
        const skip = (page - 1) * limit;

        const [items, total] = await prismaPostgres.$transaction([
            prismaPostgres.document.findMany({
                skip,
                take: limit,
                orderBy: {
                    updated_at: 'desc',
                },
                include: this.documentInclude,
            }),
            prismaPostgres.document.count(),
        ]);

        return {
            data: items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // document stats
    async getDocumentStats() {
        const [total, draft, inReview, approved, expired] = await prismaPostgres.$transaction([
            prismaPostgres.document.count(),
            prismaPostgres.document.count({ where: { status: 'DRAFT' } }),
            prismaPostgres.document.count({ where: { status: 'IN_REVIEW' } }),
            prismaPostgres.document.count({ where: { status: 'APPROVED' } }),
            prismaPostgres.document.count({ where: { status: 'EXPIRED' } }),
        ]);

        return {
            total,
            draft,
            inReview,
            approved,
            expired,
        };
    }

    // publish document
    async publishDocument(id: string) {
        return prismaPostgres.document.update({
            where: { id_document: id },
            data: {
                is_published: true,
                publication_date: new Date(),
            },
            include: this.documentInclude,
        });
    }

    // unpublish document
    async unpublishDocument(id: string) {
        return prismaPostgres.document.update({
            where: { id_document: id },
            data: {
                is_published: false,
                publication_date: null,
            },
            include: this.documentInclude,
        });
    }

    // calculate next review date vbased on frequency (DAILY, WEEKLY, ETC)
    calculateNextReviewDate(startDate: Date, frequency?: ReviewFrequency | null): Date | null {
        const nextDate = new Date(startDate);

        switch (frequency) {
            case 'DAILY':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'WEEKLY':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'MONTHLY':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'QUARTERLY':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
            case 'SEMI_ANNUAL':
                nextDate.setMonth(nextDate.getMonth() + 6);
                break;
            case 'YEARLY':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            case 'BIENNIAL':
                nextDate.setFullYear(nextDate.getFullYear() + 2);
                break;
            case 'AS_NEEDED':
                return null;
            default:
                return null;
        }

        return nextDate;
    }

    updateDocumentStatus(
        doc: Prisma.DocumentGetPayload<{ include: { document_reviewers: true, review_frequency: true } }>,
        reviews: DocumentReview[],
    ): DocumentStatus {
        const pendingReviews = reviews.filter((r) => r.id_document === doc.id_document && !r.is_completed);

        if (pendingReviews.length > 0) {
            return DocumentStatus.IN_REVIEW;
        }

        const approvedReviews = reviews.filter(
            (r) =>
                r.id_document === doc.id_document && r.is_completed && r.decision === ReviewDecision.APPROVE,
        );

        if (approvedReviews.length === doc.document_reviewers.length) {
            // Vérifier si la révision n’est pas encore expirée
            const lastReviewDate = approvedReviews
                .map((r) => r.review_date!)
                .sort((a, b) => b.getTime() - a.getTime())[0];

            if (!lastReviewDate) {
                return DocumentStatus.APPROVED;
            }

            const nextReviewDate = this.calculateNextReviewDate(
                lastReviewDate,
                doc.review_frequency?.frequency,
            );
            if (nextReviewDate && nextReviewDate < new Date()) {
                return DocumentStatus.EXPIRED;
            }
            return DocumentStatus.APPROVED;
        }

        // Par défaut, si aucune review n’a été complétée
        return DocumentStatus.DRAFT;
    }

    async filterDocuments(filter: Prisma.DocumentWhereInput) {
        return prismaPostgres.document.findMany({
            where: filter,
            include: {
                document_reviewers: {
                    select: {
                        user: {
                            select: {
                                id_user: true,
                                name: true,
                                email: true,
                                role: true,
                                created_at: true,
                            },
                        },
                    },
                },
                versions: {
                    orderBy: { created_at: 'desc' },
                    take: 1,
                    where: { is_current: true },
                    select: {
                        id_version: true,
                        created_at: true,
                        id_document: true,
                        version: true,
                    },
                },
            },
        });
    }

    // Get published document where user is in department or its classification is PUBLIC
    async getPublishedDocumentsByUserId(userId: string) {
        // get user
        const user = await prismaPostgres.user.findUnique({
            where: {
                id_user: userId,
            },
            include: {
                role: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return prismaPostgres.document.findMany({
            where: {
                is_published: true,
            },
            include: this.documentInclude,
        });
    }
}
