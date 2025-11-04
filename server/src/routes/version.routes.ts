import { Router } from 'express';
import { VersionController } from '@/controllers/version.controller';
import { googleAuthMiddleware } from '@/middlewares/google-auth';

const router = Router();
const controller = new VersionController();

router.get('/document/:documentId', controller.getVersionsByDocumentId.bind(controller));
router.get(
    '/download/:id',
    googleAuthMiddleware,
    controller.downloadFromGoogleDrive.bind(controller),
);

export default router;
