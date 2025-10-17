import cron from 'node-cron';
import { notifyReviewersJob, generateDocumentReviewsJob } from './review.job';
import { logger } from '@/utils/logger';

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
    // Every day at 1:00 AM
    safeSchedule('* * * * *', 'GENERATE_DOCUMENT_REVIEWQ', generateDocumentReviewsJob);

    // Every 15 minutes
    safeSchedule('*/15 * * * *', 'NOTIFY_REVIEWERS', notifyReviewersJob);
}
