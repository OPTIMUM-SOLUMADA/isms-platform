import { Router } from 'express';
import {
    documentReviewCreateSchema,
    documentReviewMakeDecisionSchema,
    documentReviewUpdateSchema,
} from '@/validators/documentreview.validator';
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
// Get expired reviews
router.get('/expired-reviews/:userId', controller.getExpiredReviewsByUser.bind(controller));
// Get my reviews
router.get('/my-reviews/:userId', controller.getMyReviews.bind(controller));
router.get('/my-reviews/:userId/stats', controller.getMyReviewsStats.bind(controller));
router.get('/my-reviews/:userId/due-soon', controller.getMyReviewsDueSoon.bind(controller));
router.get(
    '/document/:documentId/submitted',
    controller.getSubmittedReviewsByDocument.bind(controller),
);
router.get(
    '/document/:documentId/completed',
    controller.getCompletedReviewsByDocument.bind(controller),
);
router.post('/', validate(documentReviewCreateSchema), controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/pending-reviews', controller.findPendingReviews.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.put('/:id', validate(documentReviewUpdateSchema), controller.update.bind(controller));

// mark as completed
router.patch('/mark-as-completed/:id', controller.markAsCompleted.bind(controller));
// patch
router.patch('/:id/patch-document-version', controller.patchReview.bind(controller));

export default router;
