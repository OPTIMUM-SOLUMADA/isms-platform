import prisma from '@/database/prisma';
import { AuditEventType, Prisma } from '@prisma/client';

/**
 * Service handling creation and retrieval of audit logs
 */
export class AuditService {
    /**
     * Create a new audit log entry
     */
    static async create(data: Prisma.AuditLogCreateInput) {
        try {
            const log = await prisma.auditLog.create({
                data,
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
        const { userId, documentId, eventType, limit = 50, skip = 0 } = filters || {};

        return prisma.auditLog.findMany({
            where: {
                ...(userId && { userId }),
                ...(documentId && { documentId }),
                ...(eventType && { eventType }),
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
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
