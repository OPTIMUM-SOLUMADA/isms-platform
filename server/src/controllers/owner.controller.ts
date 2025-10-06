import { OwnerService } from '@/services/owner.service';
import { Request, Response } from 'express';
const service = new OwnerService();

export class OwnerController {
    async list(req: Request, res: Response) {
        try {
            // Get queries params
            const { limit = '50', page = '1' } = req.query;
            const filter: any = {};

            const data = await service.list({
                filter,
                page: Number(page),
                limit: Number(limit),
            });
            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: (err as Error).message });
        }
    }
}
