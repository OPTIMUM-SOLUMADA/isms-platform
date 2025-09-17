import { Request, Response } from 'express';
import { DocumentTypeService } from '@/services/documenttype.service';

const service = new DocumentTypeService();

export class DocumentTypeController {
    async create(req: Request, res: Response) {
        try {
            const { name, description, userId } = req.body;
            const clause = await service.create({
                name,
                description,
                ...(userId && { createdBy: { connect: { id: userId } } }),
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

    async findById(req: Request, res: Response) {
        try {
            const type = await service.findById(req.params.id!);
            if (!type) return res.status(404).json({ error: 'Type not found' });
            return res.json(type);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const type = await service.update(req.params.id!, req.body);
            if (!type) return res.status(404).json({ error: 'Type not found' });
            return res.json(type);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const deletedDocumentType = await service.delete(req.params.id!);
            if (!deletedDocumentType) return res.status(404).json({ error: 'Type not found' });
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async initialize(req: Request, res: Response) {
        try {
            const types = await service.init();
            return res.json(types);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
