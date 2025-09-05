import { Router } from 'express';
// import { DocumentTypeController } from '@/controllers/documenttype.controller';
import { documentTypeCreateSchema } from '@/validators/documenttype.validator'; //documentTypeUpdateSchema
import { validate } from '@/middlewares/validate';
import { DocumentReviewController } from '@/controllers/documentreview.controller';

const router = Router();
const controller = new DocumentReviewController();

router.post('/', validate(documentTypeCreateSchema), controller.create.bind(controller));
// router.post("/initialize", controller.initialize.bind(controller));
// router.get("/", controller.findAll.bind(controller));
// router.get("/:id", controller.findById.bind(controller));
// router.put("/:id", validate(documentTypeUpdateSchema), controller.update.bind(controller));
// router.delete("/:id", controller.delete.bind(controller));

export default router;
