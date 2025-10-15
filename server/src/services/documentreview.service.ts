import { EmailTemplate } from '@/configs/email-template';
import { env } from '@/configs/env';
import prisma from '@/database/prisma'; // adjust path to your prisma client
import { DocumentReview, Prisma } from '@prisma/client';
import { EmailService } from './email.service';

const emailService = new EmailService();

const includes: Prisma.DocumentReviewInclude = {
    document: {
        select: {
            id: true,
            title: true,
            status: true,
            reviewFrequency: true,
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
    documentVersion: {
        select: {
            version: true,
            createdAt: true,
            fileUrl: true,
        },
    },
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

    async assignReviewersToDocument({
        documentId,
        documentVersionId,
        reviewerIds,
        userId,
        dueDate,
    }: {
        documentId: string;
        documentVersionId: string;
        reviewerIds: string[];
        userId?: string;
        dueDate?: Date | null;
    }) {
        const data: Prisma.DocumentReviewCreateManyInput[] = reviewerIds.map((reviewerId) => ({
            documentId: documentId,
            reviewerId: reviewerId,
            dueDate: dueDate || null,
            documentVersionId: documentVersionId,
            ...(userId ? { assignedById: userId } : {}),
        }));

        return prisma.documentReview.createMany({ data });
    }

    async updateAssignedReviewersToDocument({
        documentId,
        documentVersionId,
        reviewerIds,
        userId,
        dueDate,
    }: {
        documentId: string;
        documentVersionId: string;
        reviewerIds: string[];
        userId?: string;
        dueDate?: Date | null;
    }) {
        // Delete reviews where dueDate is greater than now
        await prisma.documentReview.deleteMany({
            where: {
                documentId: documentId,
                dueDate: { gt: new Date() },
            },
        });
        const data: Prisma.DocumentReviewCreateManyInput[] = reviewerIds.map((reviewerId) => ({
            documentId: documentId,
            reviewerId: reviewerId,
            dueDate: dueDate || null,
            documentVersionId: documentVersionId,
            ...(userId ? { assignedById: userId } : {}),
        }));

        return prisma.documentReview.createMany({ data });
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

    async getReviewsByUserId({
        userId,
        limit,
        page,
        filter,
    }: {
        userId: string;
        limit: number;
        page: number;
        filter?: Prisma.DocumentReviewWhereInput;
    }) {
        const skip = (page - 1) * limit;

        const [items, total] = await prisma.$transaction([
            prisma.documentReview.findMany({
                skip,
                take: limit,
                orderBy: {
                    reviewDate: 'desc',
                },
                where: {
                    reviewerId: userId,
                    isCompleted: false,
                    ...(filter && filter),
                },
                include: includes,
            }),
            prisma.documentReview.count({
                where: {
                    reviewerId: userId,
                    isCompleted: false,
                    ...(filter && filter),
                },
            }),
        ]);

        return {
            data: items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getReviewStatsByUserId(userId: string) {
        const now = new Date();

        // Run all count queries in a single atomic transaction
        const [all, pending, expired, approved, rejected, completed] = await prisma.$transaction([
            prisma.documentReview.count({
                where: { reviewerId: userId },
            }),

            prisma.documentReview.count({
                where: {
                    reviewerId: userId,
                    isCompleted: false,
                    decision: { isSet: false },
                    reviewDate: { gte: now },
                },
            }),

            prisma.documentReview.count({
                where: {
                    reviewerId: userId,
                    isCompleted: false,
                    decision: { isSet: false },
                    reviewDate: { lte: now },
                },
            }),

            prisma.documentReview.count({
                where: {
                    reviewerId: userId,
                    decision: 'APPROVE',
                },
            }),

            prisma.documentReview.count({
                where: {
                    reviewerId: userId,
                    decision: 'REJECT',
                },
            }),

            prisma.documentReview.count({
                where: {
                    reviewerId: userId,
                    isCompleted: true,
                },
            }),
        ]);

        return {
            all,
            pending,
            expired,
            approved,
            rejected,
            completed,
        };
    }

    async findReview(filter: Prisma.DocumentReviewWhereInput) {
        return prisma.documentReview.findFirst({ where: filter, include: includes });
    }

    async getUpcomingReviews({
        targetDateStart,
        targetDateEnd,
    }: {
        targetDateStart: Date;
        targetDateEnd: Date;
    }) {
        return prisma.documentReview.findMany({
            where: {
                isCompleted: false,
                reviewDate: {
                    gte: targetDateStart,
                    lte: targetDateEnd,
                },
            },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                document: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        reviewFrequency: true,
                        versions: {
                            where: { isCurrent: true },
                            select: {
                                id: true,
                                version: true,
                                createdAt: true,
                                fileUrl: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async sendReviewNotification(review: any) {
        const { reviewer, document, dueDate } = review;

        const html = await EmailTemplate.reviewReminder({
            document: {
                title: document.title,
                description: document.description,
                status: document.status,
            },
            dueDate: dueDate?.toDateString() || '',
            reviewer: { name: reviewer.name },
            year: new Date().getFullYear().toString(),
            viewDocLink: `${env.CORS_ORIGIN}/documents/view/${document.id}`,
            reviewLink: `${env.CORS_ORIGIN}/review-approval/${review.id}`,
            headerDescription: 'Automated email',
            orgName: env.ORG_NAME,
        });

        await emailService.sendMail({
            subject: 'ISMS Solumada - Review Reminder',
            to: reviewer.email,
            html,
        });

        await prisma.documentReview.update({
            where: { id: review.id },
            data: {
                notifiedAt: new Date(),
                isNotified: true,
            },
        });
    }

    async getActiveReviews() {
        return prisma.documentReview.findMany({
            where: {
                isCompleted: false,
                decision: { isSet: false },
            },
            include: includes,
        });
    }
}
