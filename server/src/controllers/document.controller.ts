import { Request, Response } from 'express';
import { DocumentService } from '@/services/document.service';

const service = new DocumentService();

export class DocumentController {
    async create(req: Request, res: Response) {
        try {
            const document = await service.createDocument(req.body);
            res.status(201).json(document);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const document = await service.getDocumentById(req.params.id!);
            if (!document) {
                res.status(404).json({ error: 'Document not found' });
            } else {
                res.json(document);
            }
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const updated = await service.updateDocument(req.params.id!, req.body);
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await service.deleteDocument(req.params.id!);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const documents = await service.listDocuments();
            res.json(documents);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    // initialize = async (req: Request, res: Response) => {
    //     try {
    //         const documents = await service.init();
    //         res.json(documents);
    //     } catch (err) {
    //         res.status(400).json({ error: (err as Error).message });
    //     }
    // };
}
