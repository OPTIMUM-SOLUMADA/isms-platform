import prisma from '@/database/prisma';
import { Prisma, NotificationType, Classification } from '@prisma/client';
import { 
    getDocumentAssignmentMessage, 
    getPublicDocumentMessage, 
    getDocumentPublishedMessage,
    getNotificationTemplate 
} from '@/utils/notification-messages';

export class NotificationService {
    async create(data: Prisma.NotificationCreateInput) {
        return prisma.notification.create({ data });
    }

    async list({ filter = {}, page = 1, limit = 20 }: { filter?: any; page?: number; limit?: number }) {
        const where = filter || {};
        const total = await prisma.notification.count({ where });
        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                document: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
            },
        });
        return { notifications, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async findById(id: string) {
        return prisma.notification.findUnique({ 
            where: { id },
            include: {
                document: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
            },
        });
    }

    async markRead(id: string) {
        return prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } });
    }

    async markAllRead(userId: string) {
        return prisma.notification.updateMany({ where: { userId }, data: { isRead: true, readAt: new Date() } });
    }

    async delete(id: string) {
        return prisma.notification.delete({ where: { id } });
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
            user: { connect: { id: userId } },
            type,
            title: template.title,
            message: template.message,
            ...(documentId && { document: { connect: { id: documentId } } }),
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
    }: {
        userIds: string[];
        type: NotificationType;
        title: string;
        message: string;
        documentId?: string;
    }) {
        const notifications = userIds.map((userId) => ({
            userId,
            type,
            title,
            message,
            documentId: documentId ?? null,
        }));

        return prisma.notification.createMany({
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
        // Get all active users except those excluded
        const users = await prisma.user.findMany({
            where: {
                isActive: true,
                id: { notIn: excludeUserIds },
            },
            select: { id: true },
        });

        const notifications = users.map((user) => ({
            userId: user.id,
            type,
            title,
            message,
            documentId: documentId ?? null,
        }));

        return prisma.notification.createMany({
            data: notifications,
        });
    }

    /**
     * Notify users assigned to a document (authors, reviewers, owner)
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
        // Get document with all assigned users
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                authors: { select: { userId: true } },
                reviewers: { select: { userId: true } },
            },
        });

        if (!document) return;

        // Collect all unique user IDs
        const userIds = new Set<string>();
        document.authors.forEach((author) => userIds.add(author.userId));
        document.reviewers.forEach((reviewer) => userIds.add(reviewer.userId));

        // Filter out excluded users
        const filteredUserIds = Array.from(userIds).filter(
            (id) => !excludeUserIds.includes(id)
        );

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
                type: NotificationType.DOCUMENT_UPDATED,
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
                type: NotificationType.DOCUMENT_UPDATED,
                title: template.title,
                message: template.message,
                documentId,
            });
        }
    }

    /**
     * Create notification when a public document is published
     */
    async notifyDocumentPublished({
        documentId,
        documentTitle,
        documentClassification,
        creatorId,
    }: {
        documentId: string;
        documentTitle: string;
        documentClassification: Classification;
        creatorId?: string;
    }) {
        if (documentClassification === Classification.PUBLIC) {
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
}

export default new NotificationService();
