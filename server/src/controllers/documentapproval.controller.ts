import { DocumentApprovalService } from '@/services/documentapproval.service';
import { Request, Response } from 'express';

const service = new DocumentApprovalService();

export class DocumentApprovalController {
    async getByDocument(req: Request, res: Response) {
        try {
            const { documentId = '' } = req.params;

            const approvals = await service.findAll({ documentId });
            res.json(approvals);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
