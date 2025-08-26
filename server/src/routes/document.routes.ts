import express from 'express';
import { DocumentController } from '@/controllers/document.controller';
import { validate } from '@/middlewares/validate';
import { documentCreateSchema } from '@/validators/document.validator';
import { uploadSingleDocument } from '@/middlewares/upload-document';

const router = express.Router();
const controller = new DocumentController();

router.post('/', validate(documentCreateSchema), uploadSingleDocument, controller.create.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
router.get('/', controller.list.bind(controller));
// router.post('/initialize', controller.initialize);

export default router;
