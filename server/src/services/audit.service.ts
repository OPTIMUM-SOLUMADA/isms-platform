import prisma from '@/database/prisma';
import { AuditEventType, AuditStatus, AuditTargetType, Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';

const includes: Prisma.AuditLogInclude = {
    user: {
        select: { id: true, name: true, email: true },
    },
};

export type AuditLogPayload = Prisma.AuditLogGetPayload<{ include: typeof includes }>;
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

        const [items, total, events] = await prisma.$transaction([
            prisma.auditLog.findMany({
                where: customWhere,
                include: {
                    user: { select: { id: true, name: true, role: true, email: true } },
                },
                orderBy: { timestamp: 'desc' },
                skip,
                take: limit,
            }),
            prisma.auditLog.count({ where: customWhere }),
            prisma.auditLog.findMany({
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

    async getStats() {
        const now = new Date();
        const start = startOfDay(now);
        const end = endOfDay(now);
        const [total, success, failure, today] = await prisma.$transaction([
            prisma.auditLog.count(),
            prisma.auditLog.count({ where: { status: 'SUCCESS' } }),
            prisma.auditLog.count({ where: { status: 'FAILURE' } }),
            // todays events
            prisma.auditLog.count({
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
