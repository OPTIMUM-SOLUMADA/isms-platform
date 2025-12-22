import { prismaMongo, prismaPostgres } from '@/database/prisma';
import { Prisma as MongoPrisma, NotificationType } from '../../node_modules/.prisma/client/mongodb';
import {
    getDocumentAssignmentMessage,
    getPublicDocumentMessage,
    getDocumentPublishedMessage,
    getNotificationTemplate,
    getPartialApprovalMessage,
    getDocumentRejectionMessage,
} from '@/utils/notification-messages';

/**
 * Service for managing notifications
 * Uses MongoDB for notification storage (high-volume, flexible schema)
 * Uses PostgreSQL for user/document lookups (relational data)
 */
export class NotificationService {
    async create(data: MongoPrisma.NotificationCreateInput) {
        return prismaMongo.notification.create({ data });
    }

    async list({
        filter = {},
        page = 1,
        limit = 20,
    }: {
        filter?: MongoPrisma.NotificationWhereInput;
        page?: number;
        limit?: number;
    }) {
        const where = filter || {};
        const total = await prismaMongo.notification.count({ where });
        const notifications = await prismaMongo.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        // Enrich notifications with document data from PostgreSQL if documentId exists
        const enrichedNotifications = await Promise.all(
            notifications.map(async (notification) => {
                if (notification.documentId) {
                    const document = await prismaPostgres.document.findUnique({
                        where: { id_document: notification.documentId },
                        select: {
                            id_document: true,
                            title: true,
                            status: true,
                        },
                    });
                    return {
                        ...notification,
                        document: document ? {
                            id: document.id_document,
                            title: document.title,
                            status: document.status,
                        } : null,
                    };
                }
                return { ...notification, document: null };
            })
        );

        return {
            notifications: enrichedNotifications,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById(id: string) {
        const notification = await prismaMongo.notification.findUnique({
            where: { id },
        });

        if (!notification) return null;

        // Enrich with document data if exists
        if (notification.documentId) {
            const document = await prismaPostgres.document.findUnique({
                where: { id_document: notification.documentId },
                select: {
                    id_document: true,
                    title: true,
                    status: true,
                },
            });
            return {
                ...notification,
                document: document ? {
                    id: document.id_document,
                    title: document.title,
                    status: document.status,
                } : null,
            };
        }

        return { ...notification, document: null };
    }

    async markRead(id: string) {
        return prismaMongo.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
    }

    async markAllRead(userId: string) {
        return prismaMongo.notification.updateMany({
            where: { userId },
            data: { isRead: true, readAt: new Date() },
        });
    }

    async delete(id: string) {
        return prismaMongo.notification.delete({ where: { id } });
    }

    async deleteAll(userId: string) {
        return prismaMongo.notification.deleteMany({
            where: { userId },
        });
    }

    /**
     * Create a notification with automatic template based on type
     */
    async createWithTemplate({
        userId,
        type,
        documentId,
        documentTitle,
        additionalInfo,
    }: {
        userId: string;
        type: NotificationType;
        documentId?: string;
        documentTitle?: string;
        additionalInfo?: string;
    }) {
        const template = getNotificationTemplate(type, documentTitle, additionalInfo);

        return this.create({
            userId,
            type,
            title: template.title,
            message: template.message,
            ...(documentId && { documentId }),
        });
    }

    /**
     * Notify specific users about a document event
     */
    async notifyUsers({
        userIds,
        type,
        title,
        message,
        documentId,
        documentTitle,
        additionalInfo,
    }: {
        userIds: string[];
        type: NotificationType;
        title?: string;
        message?: string;
        documentId?: string;
        documentTitle?: string;
        additionalInfo?: string;
    }) {
        // Generate template if title/message not provided
        const base =
            title && message
                ? { title, message }
                : getNotificationTemplate(type, documentTitle, additionalInfo);

        const notifications = userIds.map((userId) => ({
            userId,
            type,
            title: base.title,
            message: base.message,
            documentId: documentId ?? null,
        }));

        return prismaMongo.notification.createMany({
            data: notifications,
        });
    }

    /**
     * Notify all active users about a public document event
     */
    async notifyAllUsers({
        type,
        title,
        message,
        documentId,
        excludeUserIds = [],
    }: {
        type: NotificationType;
        title: string;
        message: string;
        documentId?: string;
        excludeUserIds?: string[];
    }) {
        // Get all active users from PostgreSQL except those excluded
        const users = await prismaPostgres.user.findMany({
            where: {
                is_active: true,
                id_user: { notIn: excludeUserIds },
            },
            select: { id_user: true },
        });

        const notifications = users.map((user) => ({
            userId: user.id_user,
            type,
            title,
            message,
            documentId: documentId ?? null,
        }));

        return prismaMongo.notification.createMany({
            data: notifications,
        });
    }

    /**
     * Notify users assigned to a document (authors, reviewers)
     */
    async notifyDocumentAssignees({
        documentId,
        type,
        title,
        message,
        excludeUserIds = [],
    }: {
        documentId: string;
        type: NotificationType;
        title: string;
        message: string;
        excludeUserIds?: string[];
    }) {
        // Get document with all assigned users from PostgreSQL
        const [authors, reviewers] = await Promise.all([
            prismaPostgres.documentAuthor.findMany({
                where: { id_document: documentId },
                select: { id_user: true },
            }),
            prismaPostgres.documentReviewer.findMany({
                where: { id_document: documentId },
                select: { id_user: true },
            }),
        ]);

        // Collect all unique user IDs
        const userIds = new Set<string>();
        authors.forEach((author) => userIds.add(author.id_user));
        reviewers.forEach((reviewer) => userIds.add(reviewer.id_user));

        // Filter out excluded users
        const filteredUserIds = Array.from(userIds).filter((id) => !excludeUserIds.includes(id));

        if (filteredUserIds.length === 0) return;

        return this.notifyUsers({
            userIds: filteredUserIds,
            type,
            title,
            message,
            documentId,
        });
    }

    /**
     * Create notification when a document is created and users are assigned
     */
    async notifyDocumentCreated({
        documentId,
        documentTitle,
        authorIds = [],
        reviewerIds = [],
        creatorId,
    }: {
        documentId: string;
        documentTitle: string;
        authorIds?: string[];
        reviewerIds?: string[];
        creatorId: string;
    }) {
        // Notify authors
        const notifyAuthorIds = authorIds.filter((id) => id !== creatorId);
        if (notifyAuthorIds.length > 0) {
            const template = getDocumentAssignmentMessage('author', documentTitle);
            await this.notifyUsers({
                userIds: notifyAuthorIds,
                type: NotificationType.DOCUMENT_CREATED,
                title: template.title,
                message: template.message,
                documentId,
            });
        }

        // Notify reviewers
        const notifyReviewerIds = reviewerIds.filter((id) => id !== creatorId);
        if (notifyReviewerIds.length > 0) {
            const template = getDocumentAssignmentMessage('reviewer', documentTitle);
            await this.notifyUsers({
                userIds: notifyReviewerIds,
                type: NotificationType.DOCUMENT_CREATED,
                title: template.title,
                message: template.message,
                documentId,
            });
        }
    }

    /**
     * Create notification when a document is updated
     * Same logic as notifyDocumentCreated: notify authors and reviewers (excluding updater)
     */
    async notifyDocumentUpdated({
        documentId,
        documentTitle,
        authorIds = [],
        reviewerIds = [],
        updaterId,
    }: {
        documentId: string;
        documentTitle: string;
        authorIds?: string[];
        reviewerIds?: string[];
        updaterId: string;
    }) {
        // Prepare a generic update template
        const template = getNotificationTemplate(NotificationType.DOCUMENT_UPDATED, documentTitle);

        // Notify authors except updater
        const notifyAuthorIds = authorIds.filter((id) => id !== updaterId);
        if (notifyAuthorIds.length > 0) {
            await this.notifyUsers({
                userIds: notifyAuthorIds,
                type: NotificationType.DOCUMENT_UPDATED,
                title: template.title,
                message: template.message,
                documentId,
            });
        }

        // Notify reviewers except updater
        const notifyReviewerIds = reviewerIds.filter((id) => id !== updaterId);
        if (notifyReviewerIds.length > 0) {
            await this.notifyUsers({
                userIds: notifyReviewerIds,
                type: NotificationType.DOCUMENT_UPDATED,
                title: template.title,
                message: template.message,
                documentId,
            });
        }
    }

    /**
     * Create notification when a document is published
     */
    async notifyDocumentPublished({
        documentId,
        documentTitle,
        isPublic,
        creatorId,
    }: {
        documentId: string;
        documentTitle: string;
        isPublic: boolean;
        creatorId?: string;
    }) {
        if (isPublic) {
            // Notify all users for public documents
            const template = getPublicDocumentMessage(documentTitle);
            return this.notifyAllUsers({
                type: NotificationType.DOCUMENT_APPROVED,
                title: template.title,
                message: template.message,
                documentId,
                excludeUserIds: creatorId ? [creatorId] : [],
            });
        } else {
            // Notify only assigned users for non-public documents
            const template = getDocumentPublishedMessage(documentTitle);
            return this.notifyDocumentAssignees({
                documentId,
                type: NotificationType.DOCUMENT_APPROVED,
                title: template.title,
                message: template.message,
                excludeUserIds: creatorId ? [creatorId] : [],
            });
        }
    }

    /**
     * Notify authors about partial document approval
     */
    async notifyPartialApproval({
        documentId,
        documentTitle,
        authorIds,
        approvedReviewers,
        pendingReviewers,
    }: {
        documentId: string;
        documentTitle: string;
        authorIds: string[];
        approvedReviewers: Array<{ id: string; name: string }>;
        pendingReviewers: Array<{ id: string; name: string }>;
    }) {
        if (authorIds.length === 0) return;

        const template = getPartialApprovalMessage(
            documentTitle,
            approvedReviewers.map(r => r.name),
            pendingReviewers.map(r => r.name)
        );

        const notifications = authorIds.map((authorId) => ({
            userId: authorId,
            type: NotificationType.DOCUMENT_PARTIALLY_APPROVED,
            title: template.title,
            message: template.message,
            documentId,
            metadata: {
                approvedReviewers: approvedReviewers.map(r => ({ id: r.id, name: r.name })),
                pendingReviewers: pendingReviewers.map(r => ({ id: r.id, name: r.name })),
            },
        }));

        return prismaMongo.notification.createMany({
            data: notifications,
        });
    }

    /**
     * Notify authors about document rejection
     */
    async notifyDocumentRejection({
        documentId,
        documentTitle,
        authorIds,
        rejectedByReviewers,
    }: {
        documentId: string;
        documentTitle: string;
        authorIds: string[];
        rejectedByReviewers: Array<{ id: string; name: string }>;
    }) {
        if (authorIds.length === 0) return;

        const template = getDocumentRejectionMessage(
            documentTitle,
            rejectedByReviewers.map(r => r.name)
        );

        const notifications = authorIds.map((authorId) => ({
            userId: authorId,
            type: NotificationType.DOCUMENT_REJECTED,
            title: template.title,
            message: template.message,
            documentId,
            metadata: {
                rejectedBy: rejectedByReviewers.map(r => ({ id: r.id, name: r.name })),
            },
        }));

        return prismaMongo.notification.createMany({
            data: notifications,
        });
    }
}

export default new NotificationService();
