import { AuditService } from '@/services/audit.service';
import { AuditTargetType } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { Request, Response } from 'express';

export class AuditController {
    private service: AuditService;
    constructor() {
        this.service = new AuditService();
    }

    async getAll(req: Request, res: Response) {
        try {
            const { from, to, type } = req.query;
            const audits = await this.service.findAll({
                ...(from && { startDate: startOfDay(new Date(String(from))) }),
                ...(to && { endDate: endOfDay(new Date(String(to))) }),
                ...(type && { type: type as AuditTargetType }),
            });
            res.json(audits);
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
}
