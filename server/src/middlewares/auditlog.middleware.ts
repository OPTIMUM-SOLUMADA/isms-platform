import { AuditService } from '@/services/audit.service';
import type { AuditEventType, AuditTarget } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export interface LogPayload {
    event: AuditEventType;
    details: Record<string, any>;
    targets: AuditTarget[];
}

export const auditLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // get the IP and user agent of the request, if available
    const ip = req.headers['x-forwarded-for'] ?? '';
    const userAgent = req.headers['user-agent'] ?? '';

    req.log = async (data: LogPayload) => {
        const userId = req.body.userId || null;

        await AuditService.create({
            eventType: data.event,
            details: data.details,
            targets: data.targets,
            ipAddress: Array.isArray(ip) ? ip.join(', ') : ip,
            userAgent,
            timestamp: new Date(),
            user: { connect: { id: userId } },
        });
    };

    next();
};
