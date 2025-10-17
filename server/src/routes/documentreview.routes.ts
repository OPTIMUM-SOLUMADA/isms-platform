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

// make decision
router.put(
    '/make-decision/:id',
    validate(documentReviewMakeDecisionSchema),
    controller.makeDecision.bind(controller),
);
// Get my reviews
router.get('/my-reviews/:userId', controller.getMyReviews.bind(controller));
router.get('/my-reviews/:userId/stats', controller.getMyReviewsStats.bind(controller));
router.post('/', validate(documentReviewCreateSchema), controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/pending-reviews', controller.findPendingReviews.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.put('/:id', validate(documentReviewUpdateSchema), controller.update.bind(controller));

// mark as completed
router.patch('/mark-as-completed/:id', controller.markAsCompleted.bind(controller));

export default router;
