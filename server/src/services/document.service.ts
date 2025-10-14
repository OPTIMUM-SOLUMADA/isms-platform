import {
    DocumentReview,
    DocumentStatus,
    Prisma,
    ReviewDecision,
    ReviewFrequency,
} from '@prisma/client';
import prisma from '@/database/prisma';
import { UserService } from './user.service';
import { DocumentAuthorService } from './documentauthor.service';

export class DocumentService {
    protected userService: UserService;
    protected documentAuthorService: DocumentAuthorService;
    protected documentInclude: Prisma.DocumentInclude;
    constructor() {
        this.userService = new UserService();
        this.documentAuthorService = new DocumentAuthorService();
        this.documentInclude = {
            approvals: true,
            auditlogs: true,
            department: true,
            isoClause: true,
            reviews: true,
            versions: true,
            type: true,
            owner: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    createdAt: true,
                },
            },
            authors: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            createdAt: true,
                        },
                    },
                },
            },
            reviewers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            createdAt: true,
                        },
                    },
                },
            },
        };
    }

    async createDocument(data: Prisma.DocumentCreateInput) {
        return prisma.document.create({
            data,
            include: this.documentInclude,
        });
    }

    async createDocumentWithDetails(
        data: Prisma.DocumentCreateInput,
        ownerIds: string[],
        reviewerIds: string[],
    ) {
        return prisma.$transaction(async (tx) => {
            const doc = await tx.document.create({
                data: {
                    ...data,
                    nextReviewDate: this.calculateNextReviewDate(new Date(), data.reviewFrequency),
                },
            });
            const ownersData = ownerIds.map((userId) => ({ documentId: doc.id, userId }));
            const reviewersData = reviewerIds.map((userId) => ({ documentId: doc.id, userId }));
            // create reviewers
            await tx.documentReviewer.createMany({ data: reviewersData });
            // create owners
            await tx.documentAuthor.createMany({ data: ownersData });
            // return document
            return tx.document.findUnique({
                where: { id: doc.id },
                include: this.documentInclude,
            });
        });
    }

    async updateDocumentWithDetails(
        id: string,
        data: Prisma.DocumentUpdateInput,
        ownerIds: string[],
        reviewerIds: string[],
    ) {
        return prisma.$transaction(async (tx) => {
            // Update the document fields
            const doc = await tx.document.update({
                where: { id },
                data: {
                    ...data,
                    ...(data.reviewFrequency && {
                        nextReviewDate: this.calculateNextReviewDate(
                            new Date(),
                            data.reviewFrequency! as ReviewFrequency,
                        ),
                    }),
                },
            });

            // Replace owners (delete old, insert new)
            await tx.documentAuthor.deleteMany({ where: { documentId: id } });
            const ownersData = ownerIds.map((userId) => ({
                documentId: id,
                userId,
            }));
            if (ownersData.length) {
                await tx.documentAuthor.createMany({ data: ownersData });
            }

            // Remove reviewers (delete old, insert new)
            await tx.documentReviewer.deleteMany({ where: { documentId: id } });
            const reviewersData = reviewerIds.map((userId) => ({
                documentId: id,
                userId,
            }));
            if (reviewersData.length) {
                await tx.documentReviewer.createMany({ data: reviewersData });
            }

            // Return the updated document with owners
            return tx.document.findUnique({
                where: { id: doc.id },
                include: this.documentInclude,
            });
        });
    }

    async getDocumentById(id: string) {
        return prisma.document.findUnique({
            where: { id },
            include: this.documentInclude,
        });
    }

    async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
        return prisma.document.update({
            where: { id },
            data,
            include: this.documentInclude,
        });
    }

    async deleteDocument(id: string) {
        return prisma.document.delete({ where: { id } });
    }

    async listDocuments({ page = 1, limit = 50 }: { page: number; limit: number }) {
        const skip = (page - 1) * limit;

        const [items, total] = await prisma.$transaction([
            prisma.document.findMany({
                skip,
                take: limit,
                orderBy: {
                    updatedAt: 'desc',
                },
                include: this.documentInclude,
            }),
            prisma.document.count(),
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
        const [total, draft, inReview, approved, expired] = await prisma.$transaction([
            prisma.document.count(),
            prisma.document.count({ where: { status: 'DRAFT' } }),
            prisma.document.count({ where: { status: 'IN_REVIEW' } }),
            prisma.document.count({ where: { status: 'APPROVED' } }),
            prisma.document.count({ where: { status: 'EXPIRED' } }),
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
        return prisma.document.update({
            where: { id },
            data: {
                published: true,
                publicationDate: new Date(),
            },
            include: this.documentInclude,
        });
    }

    // unpublish document
    async unpublishDocument(id: string) {
        return prisma.document.update({
            where: { id },
            data: {
                published: false,
                publicationDate: null,
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
        doc: Prisma.DocumentGetPayload<{ include: { reviewers: true } }>,
        reviews: DocumentReview[],
    ): DocumentStatus {
        const pendingReviews = reviews.filter((r) => r.documentId === doc.id && !r.isCompleted);

        if (pendingReviews.length > 0) {
            return DocumentStatus.IN_REVIEW;
        }

        const approvedReviews = reviews.filter(
            (r) =>
                r.documentId === doc.id && r.isCompleted && r.decision === ReviewDecision.APPROVE,
        );

        if (approvedReviews.length === doc.reviewers.length) {
            // Vérifier si la révision n’est pas encore expirée
            const lastReviewDate = approvedReviews
                .map((r) => r.reviewDate!)
                .sort((a, b) => b.getTime() - a.getTime())[0];

            if (!lastReviewDate) {
                return DocumentStatus.APPROVED;
            }

            const nextReviewDate = this.calculateNextReviewDate(
                lastReviewDate,
                doc.reviewFrequency,
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
        return prisma.document.findMany({
            where: filter,
            include: {
                reviewers: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                                createdAt: true,
                            },
                        },
                    },
                },
                versions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    where: { isCurrent: true },
                    select: {
                        id: true,
                        createdAt: true,
                        documentId: true,
                        version: true,
                    },
                },
            },
        });
    }
}
