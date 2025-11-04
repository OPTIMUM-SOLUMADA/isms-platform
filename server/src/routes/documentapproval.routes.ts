import { DocumentApprovalController } from '@/controllers/documentapproval.controller';
import { Router } from 'express';

const router = Router();
const controller = new DocumentApprovalController();

router.get('/versions/document/:documentId', controller.getByDocument);

export default router;
