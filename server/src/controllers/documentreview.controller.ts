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

    async findById(req: Request, res: Response) {
        try {
            const type = await service.findByIdWithIncludedData(req.params.id!);
            if (!type) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_DOCUMENT_REVIEW_NOT_FOUND',
                });
                return;
            }
            return res.json(type);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async makeDecision(req: Request, res: Response) {
        try {
            const { decision, comment } = req.body;

            const review = await service.findById(req.params.id!);
            if (!review) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_DOCUMENT_REVIEW_NOT_FOUND',
                });
                return;
            }

            const type = await service.submitReviewDecision(req.params.id!, {
                decision,
                comment,
            });
            return res.json(type);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async markAsCompleted(req: Request, res: Response) {
        try {
            const review = await service.findById(req.params.id!);

            if (!review) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_DOCUMENT_REVIEW_NOT_FOUND',
                });
                return;
            }

            if (review.isCompleted) {
                res.status(400).json({ error: 'Document review already completed' });
                return;
            }

            const type = await service.markAsCompleted(req.params.id!);
            return res.json(type);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
