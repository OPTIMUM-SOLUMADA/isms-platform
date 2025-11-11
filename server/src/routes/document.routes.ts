import express from 'express';
import { DocumentController } from '@/controllers/document.controller';
import { validate } from '@/middlewares/validate.middleware';
import { documentCreateSchema } from '@/validators/document.validator';
import { uploadSingleDocument } from '@/middlewares/upload-document.middleware';
import { googleAuthMiddleware } from '@/middlewares/google-auth.middleware';

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
router.put('/:id', googleAuthMiddleware, uploadSingleDocument, controller.update.bind(controller));
router.delete('/:id', googleAuthMiddleware, controller.delete.bind(controller));
router.get('/', controller.list.bind(controller));
router.get(
    '/download/:id',
    googleAuthMiddleware,
    controller.downloadFromGoogleDrive.bind(controller),
);
// Published documents
router.get('/published/:userId', controller.getPublishedDocumentsUserId.bind(controller));
// publish document
router.put('/publish/:id', googleAuthMiddleware, controller.publish.bind(controller));
// unpublish document
router.put('/unpublish/:id', googleAuthMiddleware, controller.unpublish.bind(controller));
// create draft document
router.get(
    '/create-draft-version/:id',
    googleAuthMiddleware,
    controller.createDraftDocumentVersion.bind(controller),
);
// Add document to recently view
router.get('/recently-viewed/:userId', controller.getRecentlyViewed.bind(controller));
router.post(
    '/recently-viewed/add/:userId/:documentId',
    controller.addDocumentToRecentView.bind(controller),
);

export default router;
