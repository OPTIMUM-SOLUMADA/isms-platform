import { Router } from 'express';
import {
    documentReviewCreateSchema,
    documentReviewMakeDecisionSchema,
    documentReviewUpdateSchema,
} from '@/validators/documentreview.validator';
import { validate } from '@/middlewares/validate.middleware';
import { DocumentReviewController } from '@/controllers/documentreview.controller';
import { googleAuthMiddleware } from '@/middlewares/google-auth.middleware';
import { markAsCompletedSchema } from '@/validators/approval.validator';

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
// router.get('/my-reviews/:userId/approved', controller.getMyReviewsAndApproved.bind(controller));
router.get('/my-reviews/:userId/stats', controller.getMyReviewsStats.bind(controller));
router.get('/my-reviews/:userId/due-soon', controller.getMyReviewsDueSoon.bind(controller));
// Expired and due soon reviews
router.get(
    '/my-reviews/:userId/expired-and-due-soon-reviews',
    controller.getMyExpiredAndDueSoonReviews.bind(controller),
);

// Other users review on same document and version
router.get(
    '/other-users-reviews/:documentId/:versionId',
    controller.getOtherUsersReviews.bind(controller),
);

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
router.get('/pending-reviews/:userId', controller.findPendingReviews.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.put('/:id', validate(documentReviewUpdateSchema), controller.update.bind(controller));

// mark as completed
router.put(
    '/mark-as-completed/:id',
    validate(markAsCompletedSchema),
    controller.markAsCompleted.bind(controller),
);
// patch
router.patch(
    '/:id/patch-document-version',
    googleAuthMiddleware,
    controller.patchReview.bind(controller),
);

export default router;
