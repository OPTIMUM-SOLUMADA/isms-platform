import cron from 'node-cron';
import { notifyReviewersJob, generateDocumentReviewsJob } from './review.job';
import { logger } from '@/utils/logger';
import { refreshGoogleAuthTokensJob } from './google-auth.job';
import { documentReviewReminderJob } from './document-review-reminder.job';

function safeSchedule(cronExp: string, name: string, fn: () => Promise<void>) {
    cron.schedule(cronExp, async () => {
        logger.info(`[CRON] Running job: ${name}`);
        try {
            await fn();
            logger.info(`[CRON] Job "<${name}>" finished successfully`);
        } catch (err) {
            logger.error(`[CRON] Job "<${name}>" failed: ${err}`);
        }
    });
}

export function registerCronJobs() {
    // Every minute
    safeSchedule('* * * * *', 'GENERATE_DOCUMENT_REVIEWS', generateDocumentReviewsJob);
    // Every minute
    // safeSchedule('* * * * *', 'GENERATE_DOCUMENT_REVIEWS', notifyUpcomingReviewsJob);

    // Every 15 minutes
    safeSchedule('*/15 * * * *', 'NOTIFY_REVIEWERS', notifyReviewersJob);

    // Every day at 1:00 AM
    safeSchedule('0 1 * * *', 'REFRESH_GOOGLE_AUTH', refreshGoogleAuthTokensJob);

    // Every day at 8:00 AM - Check documents due for review tomorrow
    safeSchedule('45 15 * * *', 'DOCUMENT_REVIEW_REMINDER', documentReviewReminderJob);
}
