import { Router } from 'express';
import { VersionController } from '@/controllers/version.controller';

const router = Router();
const controller = new VersionController();

router.get('/versions/document/:documentId', controller.getVersionsByDocumentId);

export default router;
