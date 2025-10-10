import prisma from '@/database/prisma'; // adjust path to your prisma client
import { DocumentReview, Prisma } from '@prisma/client';

const includes: Prisma.DocumentReviewInclude = {
    document: {
        select: {
            id: true,
            title: true,
            status: true,
            isoClause: {
                select: {
                    name: true,
                    code: true,
                },
            },
            versions: {
                where: { isCurrent: true },
                select: {
                    version: true,
                    createdAt: true,
                    fileUrl: true,
                },
            },
            authors: {
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
        },
    },
    reviewer: true,
};

export class DocumentReviewService {
    async create(data: Prisma.DocumentReviewCreateInput): Promise<DocumentReview> {
        return prisma.documentReview.create({
            data,
        });
    }

    async findByIdWithIncludedData(id: string): Promise<DocumentReview | null> {
        return prisma.documentReview.findUnique({
            where: { id },
            include: {
                document: {
                    include: {
                        versions: {
                            where: { isCurrent: true },
                            select: {
                                version: true,
                                createdAt: true,
                                fileUrl: true,
                                document: {
                                    select: {
                                        title: true,
                                        description: true,
                                        status: true,
                                        isoClause: {
                                            select: {
                                                name: true,
                                                code: true,
                                            },
                                        },
                                        reviewers: {
                                            include: {
                                                user: {
                                                    select: {
                                                        name: true,
                                                        email: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        isoClause: {
                            select: {
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
                reviewer: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                assignedBy: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll(): Promise<DocumentReview[]> {
        return await prisma.documentReview.findMany({
            include: {
                document: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        isoClause: {
                            select: {
                                name: true,
                                code: true,
                            },
                        },
                        versions: {
                            where: { isCurrent: true },
                            select: {
                                version: true,
                                createdAt: true,
                                fileUrl: true,
                            },
                        },
                    },
                },
                reviewer: true,
            },
            orderBy: { reviewDate: 'desc' },
        });
    }

    async update(id: string, data: Prisma.DocumentReviewUpdateInput): Promise<DocumentReview> {
        return prisma.documentReview.update({
            where: { id },
            data,
        });
    }

    async assignReviewersToDocument(
        documentId: string,
        reviewerIds: string[],
        userId?: string,
        reviewDate?: Date | null,
    ) {
        return prisma.documentReview.createMany({
            data: reviewerIds.map((reviewerId) => ({
                documentId: documentId,
                reviewerId: reviewerId,
                reviewDate: reviewDate || null,
                ...(userId ? { assignedById: userId } : {}),
            })),
        });
    }
    async updateAssignedReviewersToDocument(
        documentId: string,
        reviewerIds: string[],
        userId?: string,
        reviewDate?: Date | null,
    ) {
        // Delete reviews where reviewDate is greater than now
        await prisma.documentReview.deleteMany({
            where: {
                documentId: documentId,
                reviewDate: { gt: new Date() },
            },
        });

        return prisma.documentReview.createMany({
            data: reviewerIds.map((reviewerId) => ({
                documentId: documentId,
                reviewerId: reviewerId,
                reviewDate: reviewDate || null,
                ...(userId ? { assignedById: userId } : {}),
            })),
        });
    }

    async submitReviewDecision(
        reviewId: string,
        data: Pick<Prisma.DocumentReviewCreateInput, 'comment' | 'decision' | 'isCompleted'>,
    ) {
        return prisma.documentReview.update({
            where: { id: reviewId },
            data,
        });
    }

    async markAsCompleted(reviewId: string) {
        return prisma.documentReview.update({
            where: { id: reviewId },
            data: {
                isCompleted: true,
                reviewDate: new Date(),
            },
        });
    }

    async findById(reviewId: string) {
        return prisma.documentReview.findFirst({
            where: {
                id: reviewId,
            },
        });
    }

    async getReviewsByUserId(userId: string) {
        return prisma.documentReview.findMany({
            where: {
                reviewerId: userId,
            },
            include: includes,
        });
    }
}
