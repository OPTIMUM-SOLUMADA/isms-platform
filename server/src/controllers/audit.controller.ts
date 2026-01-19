import { AuditLogPayload, AuditService } from '@/services/audit.service';
import { generateAuditLogsExcel } from '@/utils/audit-export';
import { f } from '@/utils/date';
import { AuditEventType, AuditStatus, AuditTargetType } from '@prisma/client';
import { endOfDay, format, startOfDay } from 'date-fns';
import { Request, Response } from 'express';

export class AuditController {
    private service: AuditService;
    constructor() {
        this.service = new AuditService();
    }

    async getAll(req: Request, res: Response) {
        try {
            const { from, to, type, eventType, page, limit, userId, status } = req.query;
            const data = await this.service.findAll({
                ...(from && { startDate: startOfDay(new Date(String(from))) }),
                ...(to && { endDate: endOfDay(new Date(String(to))) }),
                ...(type && { type: type as AuditTargetType }),
                ...(eventType && { eventType: String(eventType) as AuditEventType }),
                ...(page && { page: Number(page) }),
                ...(limit && { limit: Number(limit) }),
                ...(userId && { userId: String(userId) }),
                ...(status && { status: String(status) as AuditStatus }),
            });
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    // get stats (total, success, failures, errors, warnings)
    async getStats(req: Request, res: Response) {
        try {
            const stats = await this.service.getStats();
            res.json(stats);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async exportExcel(req: Request, res: Response) {
        try {
            const now = new Date();

            const {
                from = f(startOfDay(now)),
                to = f(endOfDay(now)),
                type,
                eventType,
                userId,
            } = req.query;

            const { data } = await this.service.findAll({
                ...(from && { startDate: startOfDay(new Date(String(from))) }),
                ...(to && { endDate: endOfDay(new Date(String(to))) }),
                ...(type && { type: type as AuditTargetType }),
                ...(eventType && { eventType: String(eventType) as AuditEventType }),
                ...(userId && { userId: String(userId) }),
            });

            const generatedExcel = await generateAuditLogsExcel(data as AuditLogPayload[], {
                includeHeaders: true,
            });

            // Audit
            await req.log({
                event: AuditEventType.EXPORT_LOGS,
                details: {
                    from: format(startOfDay(now), 'dd-MM-yyyy'),
                    to: format(endOfDay(now), 'dd-MM-yyyy'),
                },
                targets: [],
                status: 'SUCCESS',
            });

            const filename = `ISMS Audit Logs ${from} - ${to}.xlsx`;

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            res.send(generatedExcel);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }
}
