import { PrismaClient, AuditEventType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Payload for creating an audit log
 */
export interface CreateAuditLogParams {
    userId?: string;
    documentId?: string;
    organizationId?: string;
    eventType: AuditEventType;
    details?: Prisma.InputJsonValue;
    ipAddress?: string;
    userAgent?: string;
    status?: 'SUCCESS' | 'FAILED';
    sessionId?: string;
}

/**
 * Service handling creation and retrieval of audit logs
 */
export class AuditService {
    /**
     * Create a new audit log entry
     */
    static async create(params: CreateAuditLogParams) {
        try {
            const log = await prisma.auditLog.create({
                data: {
                    userId: params.userId,
                    documentId: params.documentId,
                    organizationId: params.organizationId,
                    eventType: params.eventType,
                    details: params.details,
                    ipAddress: params.ipAddress,
                    userAgent: params.userAgent,
                    status: params.status,
                    sessionId: params.sessionId,
                },
            });
            return log;
        } catch (error) {
            console.error('[AuditService.create] Error creating audit log:', error);
            throw error;
        }
    }

    /**
     * Get all logs (with optional filters)
     */
    static async findAll(filters?: {
        userId?: string;
        documentId?: string;
        organizationId?: string;
        eventType?: AuditEventType;
        limit?: number;
        skip?: number;
    }) {
        const {
            userId,
            documentId,
            organizationId,
            eventType,
            limit = 50,
            skip = 0,
        } = filters || {};

        return prisma.auditLog.findMany({
            where: {
                userId,
                documentId,
                organizationId,
                eventType,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                document: { select: { id: true, title: true } },
            },
            orderBy: { timestamp: 'desc' },
            skip,
            take: limit,
        });
    }

    /**
     * Get logs for a specific document
     */
    static async findByDocument(documentId: string, limit = 50) {
        return prisma.auditLog.findMany({
            where: { documentId },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }

    /**
     * Delete old logs (for cleanup or GDPR compliance)
     */
    static async deleteOlderThan(date: Date) {
        const result = await prisma.auditLog.deleteMany({
            where: { timestamp: { lt: date } },
        });
        return result.count;
    }
}
