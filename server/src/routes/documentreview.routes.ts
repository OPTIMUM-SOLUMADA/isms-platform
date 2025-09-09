import { Router } from 'express';
// import { DocumentReviewController } from '@/controllers/documentreview.controller';
import {
    documentReviewCreateSchema,
    documentReviewMakeDecisionSchema,
    documentReviewUpdateSchema,
} from '@/validators/documentreview.validator'; //documentTypeUpdateSchema
import { validate } from '@/middlewares/validate';
import { DocumentReviewController } from '@/controllers/documentreview.controller';

const router = Router();
const controller = new DocumentReviewController();

router.post('/', validate(documentReviewCreateSchema), controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.put('/:id', validate(documentReviewUpdateSchema), controller.update.bind(controller));

// mark as completed
router.patch('/mark-as-completed/:id', controller.markAsCompleted.bind(controller));

// make decision
router.post(
    '/make-decision/:id',
    validate(documentReviewMakeDecisionSchema),
    controller.makeDecision.bind(controller),
);

export default router;
