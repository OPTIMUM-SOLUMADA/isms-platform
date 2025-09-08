import { Request, Response } from 'express';
import { DocumentReviewService } from '@/services/documentreview.service';

const service = new DocumentReviewService();

export class DocumentReviewController {
    async create(req: Request, res: Response) {
        try {
            const { document, dueDate, reviewer } = req.body;
            const clause = await service.create({
                document: { connect: { id: document } },
                reviewer: { connect: { id: reviewer } },
                reviewDate: dueDate,
            });
            return res.status(201).json(clause);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(_req: Request, res: Response) {
        try {
            const types = await service.findAll();
            return res.json(types);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            console.log('req', req.body);
            const type = await service.update(req.params.id!, req.body);
            console.log('req 1', req.body);

            return res.json(type);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // async findById(req: Request, res: Response) {
    //     try {
    //         const type = await service.findById(req.params.id!);
    //         if (!type) return res.status(404).json({ error: 'Type not found' });
    //         return res.json(type);
    //     } catch (error: any) {
    //         return res.status(500).json({ error: error.message });
    //     }
    // }

    // async delete(req: Request, res: Response) {
    //     try {
    //         await service.delete(req.params.id!);
    //         return res.status(204).send();
    //     } catch (error: any) {
    //         return res.status(400).json({ error: error.message });
    //     }
    // }

    // async initialize(req: Request, res: Response) {
    //     try {
    //         const types = await service.init();
    //         return res.json(types);
    //     } catch (error: any) {
    //         return res.status(400).json({ error: error.message });
    //     }
    // }
}
