import { EmailTemplate } from '@/configs/email-template';
import { env } from '@/configs/env';
import { DocumentService } from '@/services/document.service';
import { DocumentReviewService } from '@/services/documentreview.service';
import { EmailService } from '@/services/email.service';
import { logger } from '@/utils/logger';
import { getNextReviewDate } from '@/utils/review';
import { addDays, endOfDay, startOfDay } from 'date-fns';

const docService = new DocumentService();
const reviewService = new DocumentReviewService();
const emailService = new EmailService();

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
            reviewDate: nextReviewDate,
        });

        count += 1;
    }

    logger.info(`[REVIEW] Created ${count} reviews`);
}

const NOTIFY_BEFORE_DAYS = 2;

export async function notifyReviewersJob() {
    logger.info('[NOTIFY] Starting notifyReviewersJob');

    try {
        const now = new Date();
        const targetDateStart = startOfDay(addDays(now, NOTIFY_BEFORE_DAYS));
        const targetDateEnd = endOfDay(addDays(now, NOTIFY_BEFORE_DAYS));

        console.log(targetDateStart, targetDateEnd);

        // Find reviews that are approaching their reviewDate
        const upcomingReviews = await reviewService.getUpcomingReviews({
            targetDateStart,
            targetDateEnd,
        });

        if (!upcomingReviews.length) {
            logger.info('[NOTIFY] No upcoming reviews to notify');
            return;
        }

        for (const review of upcomingReviews) {
            const { reviewer, document, reviewDate } = review;

            // Example: send email
            const template = await EmailTemplate.reviewReminder({
                document: {
                    title: document.title,
                    description: document.description,
                    status: document.status,
                },
                dueDate: review.reviewDate?.toDateString() || '',
                reviewer: { name: reviewer.name },
                year: new Date().getFullYear().toString(),
                viewDocLink: `${env.CORS_ORIGIN}/documents/view/${document.id}`,
                reviewLink: `${env.CORS_ORIGIN}/review-approval/${review.id}`,
                headerDescription: 'Automated email',
                orgName: env.ORG_NAME,
            });

            await emailService.sendMail({
                subject: 'ISMS Solumada - Review Reminder',
                to: reviewer.email,
                html: template,
            });

            console.log('========== Send email to', reviewer.email);

            logger.info(
                `[NOTIFY] Reviewer ${reviewer.name} for document "${document.title}" due on ${reviewDate?.toDateString()}`,
            );
        }

        logger.info(`[NOTIFY] Notified ${upcomingReviews.length} reviewers`);
    } catch (err) {
        logger.error({ err }, '[NOTIFY] notifyReviewersJob failed');
    }
}
