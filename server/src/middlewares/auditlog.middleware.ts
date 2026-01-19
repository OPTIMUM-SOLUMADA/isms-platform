import { AuditService } from '@/services/audit.service';
import { Request, Response, NextFunction } from 'express';

export const auditLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // get the IP and user agent of the request, if available
    const ip = req.headers['x-forwarded-for'] ?? req.ip ?? '';
    const userAgent = req.headers['user-agent'] ?? '';

    req.log = async (data) => {
        try {
            const userId = req.user?.id || req.body?.userId || data.details?.userId || null;

            await AuditService.create({
                eventType: data.event,
                details: data.details,
                targets: data.targets,
                ipAddress: Array.isArray(ip) ? ip.join(',') : ip,
                userAgent,
                timestamp: new Date(),
                status: data.status,
                ...(userId && { user: { connect: { id: userId } } }),
            });
        } catch (err) {
            console.error('Error logging audit:', err);
        }
    };

    next();
};
