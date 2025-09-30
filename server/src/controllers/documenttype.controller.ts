import { Request, Response } from 'express';
import { DocumentTypeService } from '@/services/documenttype.service';
import { Prisma } from '@prisma/client';

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
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(400).json({
                        error: error.message,
                        code: 'ERR_DOCUMENTTYPE_DUPLICATED_NAME',
                    });
                }
            }
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const { limit = '50', page = '1' } = req.query;
            const types = await service.list({
                page: Number(page),
                limit: Number(limit),
            });
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
            const { name, description } = req.body;
            const type = await service.update(req.params.id!, {
                name,
                description,
            });
            if (!type) return res.status(404).json({ error: 'Type not found' });
            return res.json(type);
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(400).json({
                        error: error.message,
                        code: 'ERR_DOCUMENTTYPE_DUPLICATED_NAME',
                    });
                }
            }
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

    async search(req: Request, res: Response) {
        try {
            const { q = '' } = req.query;
            const normalizedQ = q.toString().trim().toLowerCase();
            const types = await service.search(normalizedQ);
            return res.json(types);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async initialize(req: Request, res: Response) {
        try {
            const types = await service.initialize();
            return res.json(types);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
