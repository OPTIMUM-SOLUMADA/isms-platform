import prisma from '@/database/prisma';
import { AuditEventType, AuditTargetType, Prisma } from '@prisma/client';

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

    /***
     * Get all logs (with optional filters)
     */
    async findAll(filters?: {
        userId?: string;
        type?: AuditTargetType;
        organizationId?: string;
        eventType?: AuditEventType;
        limit?: number;
        skip?: number;
        startDate?: Date;
        endDate?: Date;
    }) {
        const {
            userId,
            type,
            eventType,
            limit = 100,
            skip = 0,
            startDate,
            endDate,
        } = filters || {};

        return prisma.auditLog.findMany({
            where: {
                ...(userId && { userId }),
                ...(type && { targets: { some: { type } } }),
                ...(eventType && { eventType }),
                ...(startDate || endDate
                    ? {
                          timestamp: {
                              ...(startDate && { gte: startDate }),
                              ...(endDate && { lte: endDate }),
                          },
                      }
                    : {}),
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
