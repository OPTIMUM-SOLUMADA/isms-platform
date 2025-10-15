import { DocumentService } from '@/services/document.service';
import { DocumentReviewService } from '@/services/documentreview.service';
import { logger } from '@/utils/logger';
import { getNextReviewDate, shouldNotifyReview } from '@/utils/review';

const docService = new DocumentService();
const reviewService = new DocumentReviewService();

export async function generateDocumentReviewsJob() {
    const now = new Date();
    const docs = await docService.filterDocuments({
        status: { in: ['DRAFT', 'IN_REVIEW'] },
        published: false,
        nextReviewDate: { lte: now },
    });

    console.log('Found', docs.length, 'documents to review');

    let count = 0;

    for (const doc of docs) {
        const frequency = doc.reviewFrequency;

        if (!frequency) {
            console.log('No frequency found for document', doc.id);
            continue;
        }

        const nextReviewDate = getNextReviewDate(doc.nextReviewDate, frequency);
        const lastVersionId = doc.versions[0]?.id;

        if (!lastVersionId) {
            console.log('No version found for document', doc.id);
            continue;
        }

        // Find review if already created
        const review = await reviewService.findReview({
            documentId: doc.id,
            documentVersionId: lastVersionId,
            isCompleted: false,
            reviewDate: { gte: now },
        });

        if (review) {
            console.log('Review already created for document', doc.id);
            continue;
        }

        // Upate document next review date
        await docService.updateDocument(doc.id, { nextReviewDate });

        // Create review
        await reviewService.assignReviewersToDocument({
            documentId: doc.id,
            documentVersionId: lastVersionId,
            reviewerIds: doc.reviewers.map((r) => r.user.id),
            dueDate: nextReviewDate,
        });

        count += 1;
    }

    logger.info(`[REVIEW] Created ${count} reviews`);
}

export async function notifyReviewersJob() {
    logger.info('[NOTIFY] Starting notifyReviewersJob');

    try {
        const now = new Date();

        // Fetch all active reviews
        const reviews = await reviewService.getActiveReviews();

        if (!reviews.length) {
            logger.info('[NOTIFY] No active reviews found');
            return;
        }

        let notifiedCount = 0;

        // Iterate and notify when needed
        for (const review of reviews) {
            const { document, dueDate, notifiedAt, isNotified } = review;

            if (!dueDate || isNotified) continue;

            const shouldNotify = shouldNotifyReview({
                frequency: document.reviewFrequency!,
                dueDate,
                lastNotifiedAt: notifiedAt,
                now,
            });

            if (!shouldNotify) continue;

            await reviewService.sendReviewNotification(review);
            notifiedCount++;
        }

        logger.info(`[NOTIFY] Completed. ${notifiedCount} reviewers notified.`);
    } catch (err) {
        logger.error({ err }, '[NOTIFY] notifyReviewersJob failed');
    }
}
