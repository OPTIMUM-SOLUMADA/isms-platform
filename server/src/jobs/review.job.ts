import { DocumentService } from '@/services/document.service';
import { DocumentReviewService } from '@/services/documentreview.service';
import { logger } from '@/utils/logger';
import { getNextReviewDate } from '@/utils/review';

const docService = new DocumentService();
const reviewService = new DocumentReviewService();

export async function reviewJob() {
    const now = new Date();
    const docs = await docService.filterDocuments({
        status: { in: ['DRAFT', 'IN_REVIEW'] },
        published: false,
        nextReviewDate: { lte: now },
    });

    console.log('Found', docs.length, 'documents to review');
    console.log(docs);

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
            reviewDate: nextReviewDate,
        });

        count += 1;
    }

    logger.info(`[REVIEW] Created ${count} reviews`);
}
