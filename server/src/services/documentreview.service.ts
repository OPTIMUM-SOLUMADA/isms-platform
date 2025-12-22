import { EmailTemplate } from '@/configs/email-template';
import { env } from '@/configs/env';
import { prismaPostgres, prismaMongo } from '@/database/prisma';
import { DocumentReview, Prisma, ReviewDecision } from '../../node_modules/.prisma/client/postgresql';
import { NotificationType } from '../../node_modules/.prisma/client/mongodb';
import { EmailService } from './email.service';
import { addHours, subMonths } from 'date-fns';
import { toHashRouterUrl } from '@/utils/baseurl';

const emailService = new EmailService();

const includes: Prisma.DocumentReviewInclude = {};

export class DocumentReviewService {
    async create(data: Prisma.DocumentReviewCreateInput): Promise<DocumentReview> {
        return prismaPostgres.documentReview.create({
            data,
            include: includes,
        });
    }

    async findByIdWithIncludedData(id: string) {
        return prismaPostgres.documentReview.findUnique({
            where: { id_document_review: id },
            include: {
                document: {
                    include: {
                        versions: {
                            where: { is_current: true },
                            select: {
                                version: true,
                                created_at: true,
                                file_url: true,
                                document: {
                                    select: {
                                        title: true,
                                        description: true,
                                        status: true,
                                        iso_clause: {
                                            select: {
                                                name: true,
                                                code: true,
                                            },
                                        },
                                        document_reviewers: {
                                            include: {
                                                user: {
                                                    select: {
                                                        name: true,
                                                        email: true,
                                                        created_at: true,
                                                        role: true,
                                                        department_role_users: {
                                                            select: {
                                                                id: true,
                                                                department_role: {
                                                                    select: {
                                                                        id: true,
                                                                        name: true,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        iso_clause: {
                            select: {
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        created_at: true,
                        role: true,
                        department_role_users: {
                            select: {
                                id: true,
                                department_role: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                assigned_by: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                documentVersion: {
                    select: {
                        id: true,
                        version: true,
                        created_at: true,
                        file_url: true,
                    },
                },
            },
        });
    }

    async findAll(): Promise<DocumentReview[]> {
        return await prismaPostgres.documentReview.findMany({
            include: {
                document: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        iso_clause: {
                            select: {
                                name: true,
                                code: true,
                            },
                        },
                        versions: {
                            where: { is_current: true },
                            select: {
                                version: true,
                                created_at: true,
                                file_url: true,
                            },
                        },
                    },
                },
                reviewer: true,
                completed_by: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        created_at: true,
                        department_role_users: {
                            select: {
                                id: true,
                                department_role: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { review_date: 'desc' },
        });
    }

    async findPendingReviews(userId?: string): Promise<DocumentReview[]> {
        return prismaPostgres.documentReview.findMany({
            where: {
                decision: { not: null },
                is_completed: false,
                ...(userId && {
                    document: {
                        authors: {
                            some: {
                                userId,
                            },
                        },
                    },
                }),
            },
            include: {
                document: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        file_url: true,
                        iso_clause: {
                            select: {
                                name: true,
                                code: true,
                            },
                        },
                        versions: {
                            where: { is_current: true },
                            select: {
                                version: true,
                                created_at: true,
                                file_url: true,
                            },
                        },
                    },
                },
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        created_at: true,
                        role: true,
                        department_role_users: {
                            select: {
                                id: true,
                                department_role: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async update(id: string, data: Prisma.DocumentReviewUpdateInput): Promise<DocumentReview> {
        return prismaPostgres.documentReview.update({
            where: { id_document_review: id },
            data,
        });
    }

    async assigndocument_reviewersToDocument({
        id_document,
        id_version,
        id_document_reviewers,
        userId,
        due_date,
    }: {
        id_document: string;
        id_version: string;
        id_document_reviewers: string[];
        userId?: string;
        due_date?: Date | null;
    }) {
        const data: Prisma.DocumentReviewCreateManyInput[] = id_document_reviewers.map((id_reviewer) => ({
            id_document: id_document,
            id_reviewer: id_reviewer,
            due_date: due_date || null,
            id_version: id_version,
            ...(userId ? { assigned_byId: userId } : {}),
        }));

        return prismaPostgres.documentReview.createMany({ data });
    }

    async updateAssigneddocument_reviewersToDocument({
        id_document,
        id_version,
        id_document_reviewers,
        userId,
        due_date,
    }: {
        id_document: string;
        id_version: string;
        id_document_reviewers: string[];
        userId?: string;
        due_date?: Date | null;
    }) {
        // Delete reviews where due_date is greater than now
        await prismaPostgres.documentReview.deleteMany({
            where: {
                id_document: id_document,
                due_date: { gt: new Date() },
            },
        });
        const data: Prisma.DocumentReviewCreateManyInput[] = id_document_reviewers.map((id_reviewer) => ({
            id_document: id_document,
            id_reviewer: id_reviewer,
            due_date: due_date || null,
            id_version: id_version,
            ...(userId ? { assigned_byId: userId } : {}),
        }));

        return prismaPostgres.documentReview.createMany({ data });
    }

    async submitReviewDecision(
        reviewId: string,
        data: Pick<
            Prisma.DocumentReviewCreateInput,
            'comment' | 'decision' | 'is_completed' | 'completed_at' | 'completed_by'
        >,
    ) {
        return prismaPostgres.documentReview.update({
            where: { id: reviewId },
            data: {
                ...data,
                review_date: new Date(),
            },
        });
    }

    async markAsCompleted(reviewId: string) {
        return prismaPostgres.documentReview.update({
            where: { id: reviewId },
            data: {
                is_completed: true,
                completed_at: new Date(),
            },
        });
    }

    async findById(reviewId: string) {
        return prismaPostgres.documentReview.findFirst({
            where: {
                id: reviewId,
            },
            include: includes,
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

        const [items, total] = await prismaPostgres.$transaction([
            prismaPostgres.documentReview.findMany({
                skip,
                take: limit,
                orderBy: {
                    created_at: 'desc',
                },
                where: {
                    id_reviewer: userId,
                    is_completed: false,
                    ...(filter && filter),
                },
                include: includes,
            }),
            prismaPostgres.documentReview.count({
                where: {
                    id_reviewer: userId,
                    is_completed: false,
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

    async getReviewsAndApprovedByUserId({
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

        const [items, total] = await prismaPostgres.$transaction([
            prismaPostgres.documentReview.findMany({
                skip,
                take: limit,
                orderBy: {
                    created_at: 'desc',
                },
                where: {
                    id_reviewer: userId,
                    is_completed: false,
                    decision: 'APPROVE',
                    ...(filter && filter),
                },
                include: includes,
            }),
            prismaPostgres.documentReview.count({
                where: {
                    id_reviewer: userId,
                    is_completed: false,
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
        const [all, pending, expired, approved, rejected, completed] = await prismaPostgres.$transaction([
            prismaPostgres.documentReview.count({
                where: { id_reviewer: userId, is_completed: false },
            }),

            prismaPostgres.documentReview.count({
                where: {
                    id_reviewer: userId,
                    is_completed: false,
                    decision: null,
                    OR: [{ due_date: null }, { due_date: { gte: now } }],
                },
            }),

            prismaPostgres.documentReview.count({
                where: {
                    id_reviewer: userId,
                    is_completed: false,
                    decision: null,
                    due_date: { lte: now },
                },
            }),

            prismaPostgres.documentReview.count({
                where: {
                    id_reviewer: userId,
                    is_completed: false,
                    decision: 'APPROVE',
                },
            }),

            prismaPostgres.documentReview.count({
                where: {
                    id_reviewer: userId,
                    is_completed: false,
                    decision: 'REJECT',
                },
            }),

            prismaPostgres.documentReview.count({
                where: {
                    id_reviewer: userId,
                    is_completed: true,
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
        return prismaPostgres.documentReview.findFirst({ where: filter, include: includes });
    }

    async getUpcomingReviews({
        targetDateStart,
        targetDateEnd,
    }: {
        targetDateStart: Date;
        targetDateEnd: Date;
    }) {
        return prismaPostgres.documentReview.findMany({
            where: {
                is_completed: false,
                review_date: {
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
                            where: { is_current: true },
                            select: {
                                id: true,
                                version: true,
                                created_at: true,
                                file_url: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async sendReviewNotification(review: any) {
        const { reviewer, document, due_date } = review;

        const html = await EmailTemplate.reviewReminder({
            document: {
                title: document.title,
                description: document.description,
                status: document.status,
            },
            due_date: due_date?.toDateString() || 'ASAP',
            reviewer: { name: reviewer.name },
            year: new Date().getFullYear().toString(),
            viewDocLink: toHashRouterUrl(`/documents/view/${document.id}`),
            reviewLink: toHashRouterUrl(`/review-approval/${review.id}`),
            headerDescription: 'Automated email',
            orgName: env.ORG_NAME,
        });

        try {
            await emailService.sendMail({
                subject: `ISMS Solumada - Review Reminder (${document.title})`,
                to: reviewer.email,
                html,
            });

            await prismaPostgres.documentReview.update({
                where: { id: review.id },
                data: {
                    notified_at: new Date(),
                    is_notified: true,
                },
            });
        } catch (err) {
            console.log('Unable to send emails', err);
        }
    }

    async getActiveReviews() {
        return prismaPostgres.documentReview.findMany({
            where: {
                is_completed: false,
                decision: null,
            },
            include: includes,
        });
    }

    async getMyReviewsDueSoon(userId?: string) {
        const now = new Date();
        const treeHoursLater = addHours(now, 3);

        return prismaPostgres.documentReview.findMany({
            where: {
                ...(userId && { id_reviewer: userId }),
                is_completed: false,
                decision: null,
                due_date: {
                    gte: now,
                    lte: treeHoursLater,
                },
            },
            include: includes,
        });
    }

    async getSubmittedReviewsByDocument(id_document: string) {
        return prismaPostgres.documentReview.findMany({
            where: { id_document, decision: { not: null }, is_completed: false },
            include: includes,
        });
    }

    async getCompletedReviewsByDocument(id_document: string) {
        return prismaPostgres.documentReview.findMany({
            where: { id_document, decision: { not: null }, is_completed: true },
            include: includes,
            orderBy: { completed_at: 'desc' },
        });
    }

    async getExpiredReviewsByUser(userId: string) {
        return prismaPostgres.documentReview.findMany({
            where: {
                id_reviewer: userId,
                is_completed: false,
                decision: null,
                due_date: { lte: new Date() },
            },
            include: includes,
        });
    }

    async getExpiredAndDueSoonReviewsByUser(userId: string) {
        const now = new Date();
        const treeHoursLater = addHours(now, 3);

        const [expired, dueSoon] = await prismaPostgres.$transaction([
            // EXPIRED REVIEWS
            prismaPostgres.documentReview.findMany({
                where: {
                    id_reviewer: userId,
                    is_completed: false,
                    decision: null,
                    due_date: { lte: new Date() },
                },
                include: includes,
            }),
            // DUE SOON REVIEWS
            prismaPostgres.documentReview.findMany({
                where: {
                    ...(userId && { id_reviewer: userId }),
                    is_completed: false,
                    decision: null,
                    due_date: {
                        gte: now,
                        lte: treeHoursLater,
                    },
                },
                include: includes,
            }),
        ]);

        return { expired, dueSoon };
    }

    async getOtherUsersReviews(id_document: string, versionId: string) {
        return prismaPostgres.documentReview.findMany({
            where: {
                id_document,
                id_version: versionId,
                is_completed: false,
            },
            include: includes,
            orderBy: { completed_at: 'desc' },
        });
    }

    async sendUpcomingReviewNotification({
        id_document,
        nextreview_date,
    }: {
        id_document: string;
        nextreview_date: Date;
    }) {
        if (!nextreview_date) return;

        const notifyDate = subMonths(nextreview_date, 1);
        const now = new Date();
        if (now < notifyDate) return;

        const document = await prismaPostgres.document.findUnique({
            where: { id: id_document },
            include: {
                document_reviewers: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
            },
        });

        if (!document || !document.document_reviewers.length) return;

        for (const reviewer of document.document_reviewers) {
            await prismaMongo.notification.create({
                data: {
                    userId: reviewer.user.id,
                    type: NotificationType.REVIEW_NEEDED,
                    title: 'Upcoming Document Review',
                    message: `The document "${document.title}" is scheduled for review on ${nextreview_date.toDateString()}. Please prepare.`,
                    id_document: document.id,
                },
            });
        }

        console.log(`[NOTIFY] Upcoming review notification sent for document ${id_document}`);
    }

}
