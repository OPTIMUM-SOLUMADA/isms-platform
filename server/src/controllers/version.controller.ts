import { DocumentVersionService } from '@/services/documentversion.service';
import { Request, Response } from 'express';

export class VersionController {
    private service: DocumentVersionService;

    constructor() {
        this.service = new DocumentVersionService();
    }

    async getVersionsByDocumentId(req: Request, res: Response) {
        try {
            const versions = await this.service.getByDocumentId(req.params.documentId!);
            res.json(versions);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to get versions' });
        }
    }
}
