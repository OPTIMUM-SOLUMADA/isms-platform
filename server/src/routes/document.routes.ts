import express from 'express';
import { DocumentController } from '@/controllers/document.controller';
import { validate } from '@/middlewares/validate';
import { documentCreateSchema } from '@/validators/document.validator';
import { uploadSingleDocument } from '@/middlewares/upload-document';
import { googleAuthMiddleware } from '@/middlewares/google-auth';

const router = express.Router();
const controller = new DocumentController();

router.post(
    '/',
    validate(documentCreateSchema),
    googleAuthMiddleware,
    uploadSingleDocument,
    controller.create.bind(controller),
);
router.get('/statistics', controller.getStatistics.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', uploadSingleDocument, controller.update.bind(controller));
router.delete('/:id', googleAuthMiddleware, controller.delete.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/download/:id', controller.downloadFromGoogleDrive.bind(controller));
// publish document
router.put('/publish/:id', controller.publish.bind(controller));
// unpublish document
router.put('/unpublish/:id', controller.unpublish.bind(controller));

export default router;
