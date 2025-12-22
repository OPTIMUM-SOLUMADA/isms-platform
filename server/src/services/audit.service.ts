import { prismaMongo } from '@/database/prisma';
import { 
    AuditEventType, 
    AuditStatus, 
    AuditTargetType, 
    Prisma 
} from '../../node_modules/.prisma/client/mongodb';
import { endOfDay, startOfDay } from 'date-fns';

/**
 * Service handling creation and retrieval of audit logs
 * Uses MongoDB for high-volume, flexible schema audit logging
 */
export class AuditService {
    /**
     * Create a new audit log entry
     */
    static async create(data: Prisma.AuditLogCreateInput) {
        try {
            const log = await prismaMongo.auditLog.create({
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
        page?: number;
        startDate?: Date;
        endDate?: Date;
        status?: AuditStatus;
    }) {
        const {
            userId,
            type,
            eventType,
            limit = 100,
            page = 1,
            startDate,
            endDate,
            status,
        } = filters || {};

        const skip = (page - 1) * limit;

        const customWhere: Prisma.AuditLogWhereInput = {
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
            ...(status && { status }),
        };

        const [items, total, events] = await prismaMongo.$transaction([
            prismaMongo.auditLog.findMany({
                where: customWhere,
                orderBy: { timestamp: 'desc' },
                skip,
                take: limit,
            }),
            prismaMongo.auditLog.count({ where: customWhere }),
            prismaMongo.auditLog.findMany({
                distinct: ['eventType'],
                select: { eventType: true },
            }),
        ]);

        return {
            data: items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            events: events.map((e) => e.eventType),
        };
    }

    /**
     * Get logs for a specific document
     */
    static async findByDocument(documentId: string, limit = 50) {
        return prismaMongo.auditLog.findMany({
            where: {
                targets: {
                    some: {
                        id: documentId,
                        type: 'DOCUMENT',
                    },
                },
            },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }

    /**
     * Delete old logs (for cleanup or GDPR compliance)
     */
    static async deleteOlderThan(date: Date) {
        const result = await prismaMongo.auditLog.deleteMany({
            where: { timestamp: { lt: date } },
        });
        return result.count;
    }

    async getStats() {
        const now = new Date();
        const start = startOfDay(now);
        const end = endOfDay(now);
        const [total, success, failure, today] = await prismaMongo.$transaction([
            prismaMongo.auditLog.count(),
            prismaMongo.auditLog.count({ where: { status: 'SUCCESS' } }),
            prismaMongo.auditLog.count({ where: { status: 'FAILURE' } }),
            // todays events
            prismaMongo.auditLog.count({
                where: {
                    timestamp: {
                        gte: start,
                        lte: end,
                    },
                },
            }),
        ]);

        return {
            total,
            success,
            failure,
            today,
        };
    }
}
