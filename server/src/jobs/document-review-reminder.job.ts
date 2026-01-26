import { DocumentService } from '@/services/document.service';
import { NotificationService } from '@/services/notification.service';
import { EmailService } from '@/services/email.service';
import { DocumentReviewService } from '@/services/documentreview.service';
import { logger } from '@/utils/logger';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { ClauseComplianceStatus, DocumentStatus } from '@prisma/client';
import { getDocumentReviewReminderEmailTemplate } from '@/templates/emails/document-review-reminder.template';
import { ComplianceService } from '@/services/compliance.service';
import prisma from '@/database/prisma';

const documentService = new DocumentService();
const notificationService = new NotificationService();
const emailService = new EmailService();
const reviewService = new DocumentReviewService();
const complianceService = new ComplianceService();

interface DocumentToReview {
    id: string;
    title: string;
    nextReviewDate: Date;
    status: DocumentStatus;
    published: boolean;
    authors: Array<{ user: { id: string; name: string; email: string } }>;
    reviewers: Array<{ user: { id: string; name: string; email: string } }>;
    versions: Array<{ id: string; isCurrent: boolean }>;
}

/**
 * Scheduled job that runs daily to identify documents due for review tomorrow
 * and performs the following actions:
 * 1. If document is published, unpublish it
 * 2. If document status is APPROVED, change to IN_REVIEW
 * 3. Send email notifications to authors and reviewers
 */
export async function documentReviewReminderJob(): Promise<void> {
    console.log("******** ======== **********");
    
    logger.info('[REVIEW_REMINDER] Starting document review reminder job');

    try {
        const documentsToReview = await findDocumentsDueForReviewTomorrow();
        
        if (documentsToReview.length === 0) {
            logger.info('[REVIEW_REMINDER] No documents due for review tomorrow');
            return;
        }

        logger.info(`[REVIEW_REMINDER] Found ${documentsToReview.length} documents due for review tomorrow`);
        console.log(`[REVIEW_REMINDER] Found ${documentsToReview.length} documents due for review tomorrow`);

        let processedCount = 0;
        let errorCount = 0;

        for (const document of documentsToReview) {
            try {
                // 1. Reset reviews for current version
                await resetReviewsForCurrentVersion(document);

                // 2. Continue existing logic (emails, notifications, etc.)
                await processDocumentReview(document);
                processedCount++;
            } catch (error) {
                errorCount++;
                logger.error(
                    { error, documentId: document.id },
                    `[REVIEW_REMINDER] Failed to process document: ${document.title}`
                );
            }
        }

        console.log(`[REVIEW_REMINDER] Job completed. Processed: ${processedCount}, Errors: ${errorCount}`);
        
        logger.info(
            `[REVIEW_REMINDER] Job completed. Processed: ${processedCount}, Errors: ${errorCount}`
        );
    } catch (error) {
        logger.error({ error }, '[REVIEW_REMINDER] Job failed');
        throw error;
    }
}

async function resetReviewsForCurrentVersion(document: {
  id: string;
  versions: { id: string; isCurrent: boolean }[];
}) {
  const currentVersion = document.versions.find(v => v.isCurrent);

  if (!currentVersion) {
    logger.warn(
      { documentId: document.id },
      '[REVIEW_REMINDER] No current version found, skipping reset',
    );
    return;
  }

  await prisma.documentReview.updateMany({
    where: {
      documentId: document.id,
      documentVersionId: currentVersion.id,
    },
    data: {
      decision: null,
      isCompleted: false,
      completedAt: null,
      reviewDate: null,
    },
  });

  logger.info(
    {
      documentId: document.id,
      documentVersionId: currentVersion.id,
    },
    '[REVIEW_REMINDER] Reviews reset for current version',
  );
}


/**
 * Find all documents whose nextReviewDate is tomorrow
 */
async function findDocumentsDueForReviewTomorrow(): Promise<DocumentToReview[]> {
    const tomorrow = addDays(new Date(), 1);
    const tomorrowStart = startOfDay(tomorrow);
    const tomorrowEnd = endOfDay(tomorrow);

    const documents = await documentService.filterDocuments({
        nextReviewDate: {
            gte: tomorrowStart,
            lte: tomorrowEnd,
        },
    });

    return documents as unknown as DocumentToReview[];
}

/**
 * Process a single document review:
 * - Unpublish if published
 * - Change status from APPROVED to IN_REVIEW if applicable
 * - Send notifications to authors and reviewers
 */
async function processDocumentReview(document: DocumentToReview): Promise<void> {
    logger.info(`[REVIEW_REMINDER] Processing document: ${document.title} (ID: ${document.id})`);

    const updateData: { published?: boolean; status?: DocumentStatus } = {};

    // Check if document is published and needs to be unpublished
    if (document.published) {
        updateData.published = false;
        logger.info(`[REVIEW_REMINDER] Unpublishing document: ${document.title}`);
    }

    // Check if status is APPROVED and needs to be changed to IN_REVIEW
    if (document.status === DocumentStatus.APPROVED) {
        updateData.status = DocumentStatus.IN_REVIEW;
        logger.info(`[REVIEW_REMINDER] Changing status to IN_REVIEW: ${document.title}`);
    }

    // Update document if there are changes
    if (Object.keys(updateData).length > 0) {
        await documentService.updateDocument(document.id, updateData);
    }

// Update existing incomplete reviews with empty comments
    const incompleteReviews = await reviewService.findByIdWithIncludedData(document.id);
    const compliance = await complianceService.getByDocument(document.id);
    await complianceService.update(compliance?.id!, {
        status: ClauseComplianceStatus.NON_COMPLIANT
    });
    
    const reviewsToUpdate = Array.isArray(incompleteReviews) 
        ? incompleteReviews.filter(review => !review.isCompleted && !review.comment)
        : [];

    if (reviewsToUpdate && reviewsToUpdate.length > 0) {
        logger.info(
            `[REVIEW_REMINDER] Found ${reviewsToUpdate.length} incomplete reviews with empty comments for document: ${document.title}`
        );

        for (const review of reviewsToUpdate) {
            await reviewService.update(review.id, {
                isCompleted: false,
                comment: '',
            });
        }

        logger.info(
            `[REVIEW_REMINDER] Updated ${reviewsToUpdate.length} incomplete reviews for document: ${document.title}`
        );
    }

    // Send notifications to all stakeholders
    await sendReviewNotifications(document);
}

/**
 * Send email and in-app notifications to authors and reviewers
 */
async function sendReviewNotifications(document: DocumentToReview): Promise<void> {
    const recipients = getUniqueRecipients(document);

    logger.info(
        `[REVIEW_REMINDER] Sending notifications to ${recipients.length} recipients for document: ${document.title}`
    );

    const notificationPromises = recipients.map(async (recipient) => {
        try {
            // Create in-app notification
            await createInAppNotification(document, recipient.id);

            // Send email notification
            await sendEmailNotification(document, recipient);

            logger.info(
                `[REVIEW_REMINDER] Notification sent to ${recipient.name} (${recipient.email})`
            );
        } catch (error) {
            logger.error(
                { error, recipientId: recipient.id },
                `[REVIEW_REMINDER] Failed to send notification to ${recipient.name}`
            );
            throw error;
        }
    });

    await Promise.all(notificationPromises);
}

/**
 * Get unique list of recipients (authors and reviewers) to avoid duplicates
 */
function getUniqueRecipients(
    document: DocumentToReview
): Array<{ id: string; name: string; email: string }> {
    const recipientsMap = new Map<string, { id: string; name: string; email: string }>();

    // Add authors
    document.authors.forEach((author) => {
        recipientsMap.set(author.user.id, author.user);
    });

    // Add reviewers
    document.reviewers.forEach((reviewer) => {
        recipientsMap.set(reviewer.user.id, reviewer.user);
    });

    return Array.from(recipientsMap.values());
}

/**
 * Create in-app notification for a user
 */
async function createInAppNotification(
    document: DocumentToReview,
    userId: string
): Promise<void> {
    await notificationService.createWithTemplate({
        userId,
        type: 'DOCUMENT_REVIEW_REMINDER' as any,
        documentId: document.id,
        documentTitle: document.title,
        additionalInfo: `Review scheduled for ${document.nextReviewDate.toLocaleDateString()}`,
    });
}

/**
 * Send email notification to a user
 */
async function sendEmailNotification(
    document: DocumentToReview,
    recipient: { name: string; email: string }
): Promise<void> {
    const subject = `Révision requise : ${document.title}`;
    
    const loginUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    const htmlContent = getDocumentReviewReminderEmailTemplate({
        recipientName: recipient.name,
        documentTitle: document.title,
        reviewDate: document.nextReviewDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        documentId: document.id,
        loginUrl: `${loginUrl}/documents/view/${document.id}`,
    });

    await emailService.sendMail({
        to: recipient.email,
        subject,
        html: htmlContent,
    });
}
