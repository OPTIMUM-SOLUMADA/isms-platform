import { documentReviewReminderJob } from '../../src/jobs/document-review-reminder.job';
import { DocumentService } from '@/services/document.service';
import { NotificationService } from '@/services/notification.service';
import { EmailService } from '@/services/email.service';
import { DocumentStatus } from '@prisma/client';
import { addDays } from 'date-fns';

// Mock services
jest.mock('@/services/document.service');
jest.mock('@/services/notification.service');
jest.mock('@/services/email.service');
jest.mock('@/utils/logger');

describe('Document Review Reminder Job', () => {
    let mockDocumentService: jest.Mocked<DocumentService>;
    let mockNotificationService: jest.Mocked<NotificationService>;
    let mockEmailService: jest.Mocked<EmailService>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDocumentService = new DocumentService() as jest.Mocked<DocumentService>;
        mockNotificationService = new NotificationService() as jest.Mocked<NotificationService>;
        mockEmailService = new EmailService() as jest.Mocked<EmailService>;
    });

    describe('documentReviewReminderJob', () => {
        it('should process no documents when none are due for review tomorrow', async () => {
            mockDocumentService.filterDocuments = jest.fn().mockResolvedValue([]);

            await documentReviewReminderJob();

            expect(mockDocumentService.filterDocuments).toHaveBeenCalledTimes(1);
            expect(mockDocumentService.updateDocument).not.toHaveBeenCalled();
        });

        it('should unpublish a published document', async () => {
            const tomorrow = addDays(new Date(), 1);
            const mockDocument = {
                id: 'doc-1',
                title: 'Test Document',
                nextReviewDate: tomorrow,
                status: DocumentStatus.DRAFT,
                published: true,
                authors: [{ user: { id: 'user-1', name: 'Author', email: 'author@test.com' } }],
                reviewers: [{ user: { id: 'user-2', name: 'Reviewer', email: 'reviewer@test.com' } }],
            };

            mockDocumentService.filterDocuments = jest.fn().mockResolvedValue([mockDocument]);
            mockDocumentService.updateDocument = jest.fn().mockResolvedValue(mockDocument);
            mockNotificationService.createWithTemplate = jest.fn().mockResolvedValue({});
            mockEmailService.sendMail = jest.fn().mockResolvedValue({});

            await documentReviewReminderJob();

            expect(mockDocumentService.updateDocument).toHaveBeenCalledWith('doc-1', {
                published: false,
            });
        });

        it('should change status from APPROVED to IN_REVIEW', async () => {
            const tomorrow = addDays(new Date(), 1);
            const mockDocument = {
                id: 'doc-2',
                title: 'Approved Document',
                nextReviewDate: tomorrow,
                status: DocumentStatus.APPROVED,
                published: false,
                authors: [{ user: { id: 'user-1', name: 'Author', email: 'author@test.com' } }],
                reviewers: [{ user: { id: 'user-2', name: 'Reviewer', email: 'reviewer@test.com' } }],
            };

            mockDocumentService.filterDocuments = jest.fn().mockResolvedValue([mockDocument]);
            mockDocumentService.updateDocument = jest.fn().mockResolvedValue(mockDocument);
            mockNotificationService.createWithTemplate = jest.fn().mockResolvedValue({});
            mockEmailService.sendMail = jest.fn().mockResolvedValue({});

            await documentReviewReminderJob();

            expect(mockDocumentService.updateDocument).toHaveBeenCalledWith('doc-2', {
                status: DocumentStatus.IN_REVIEW,
            });
        });

        it('should unpublish and change status for a published approved document', async () => {
            const tomorrow = addDays(new Date(), 1);
            const mockDocument = {
                id: 'doc-3',
                title: 'Published Approved Document',
                nextReviewDate: tomorrow,
                status: DocumentStatus.APPROVED,
                published: true,
                authors: [{ user: { id: 'user-1', name: 'Author', email: 'author@test.com' } }],
                reviewers: [{ user: { id: 'user-2', name: 'Reviewer', email: 'reviewer@test.com' } }],
            };

            mockDocumentService.filterDocuments = jest.fn().mockResolvedValue([mockDocument]);
            mockDocumentService.updateDocument = jest.fn().mockResolvedValue(mockDocument);
            mockNotificationService.createWithTemplate = jest.fn().mockResolvedValue({});
            mockEmailService.sendMail = jest.fn().mockResolvedValue({});

            await documentReviewReminderJob();

            expect(mockDocumentService.updateDocument).toHaveBeenCalledWith('doc-3', {
                published: false,
                status: DocumentStatus.IN_REVIEW,
            });
        });

        it('should send notifications to all authors and reviewers', async () => {
            const tomorrow = addDays(new Date(), 1);
            const mockDocument = {
                id: 'doc-4',
                title: 'Test Document',
                nextReviewDate: tomorrow,
                status: DocumentStatus.APPROVED,
                published: true,
                authors: [
                    { user: { id: 'user-1', name: 'Author 1', email: 'author1@test.com' } },
                    { user: { id: 'user-2', name: 'Author 2', email: 'author2@test.com' } },
                ],
                reviewers: [
                    { user: { id: 'user-3', name: 'Reviewer 1', email: 'reviewer1@test.com' } },
                    { user: { id: 'user-4', name: 'Reviewer 2', email: 'reviewer2@test.com' } },
                ],
            };

            mockDocumentService.filterDocuments = jest.fn().mockResolvedValue([mockDocument]);
            mockDocumentService.updateDocument = jest.fn().mockResolvedValue(mockDocument);
            mockNotificationService.createWithTemplate = jest.fn().mockResolvedValue({});
            mockEmailService.sendMail = jest.fn().mockResolvedValue({});

            await documentReviewReminderJob();

            // Should send 4 in-app notifications (2 authors + 2 reviewers)
            expect(mockNotificationService.createWithTemplate).toHaveBeenCalledTimes(4);

            // Should send 4 emails (2 authors + 2 reviewers)
            expect(mockEmailService.sendMail).toHaveBeenCalledTimes(4);
        });

        it('should avoid duplicate notifications for users who are both author and reviewer', async () => {
            const tomorrow = addDays(new Date(), 1);
            const mockDocument = {
                id: 'doc-5',
                title: 'Test Document',
                nextReviewDate: tomorrow,
                status: DocumentStatus.APPROVED,
                published: true,
                authors: [{ user: { id: 'user-1', name: 'User', email: 'user@test.com' } }],
                reviewers: [{ user: { id: 'user-1', name: 'User', email: 'user@test.com' } }],
            };

            mockDocumentService.filterDocuments = jest.fn().mockResolvedValue([mockDocument]);
            mockDocumentService.updateDocument = jest.fn().mockResolvedValue(mockDocument);
            mockNotificationService.createWithTemplate = jest.fn().mockResolvedValue({});
            mockEmailService.sendMail = jest.fn().mockResolvedValue({});

            await documentReviewReminderJob();

            // Should send only 1 notification (user is both author and reviewer)
            expect(mockNotificationService.createWithTemplate).toHaveBeenCalledTimes(1);
            expect(mockEmailService.sendMail).toHaveBeenCalledTimes(1);
        });

        it('should handle errors gracefully for individual documents', async () => {
            const tomorrow = addDays(new Date(), 1);
            const mockDocuments = [
                {
                    id: 'doc-success',
                    title: 'Success Document',
                    nextReviewDate: tomorrow,
                    status: DocumentStatus.APPROVED,
                    published: true,
                    authors: [{ user: { id: 'user-1', name: 'Author', email: 'author@test.com' } }],
                    reviewers: [{ user: { id: 'user-2', name: 'Reviewer', email: 'reviewer@test.com' } }],
                },
                {
                    id: 'doc-error',
                    title: 'Error Document',
                    nextReviewDate: tomorrow,
                    status: DocumentStatus.APPROVED,
                    published: true,
                    authors: [{ user: { id: 'user-3', name: 'Author', email: 'author3@test.com' } }],
                    reviewers: [{ user: { id: 'user-4', name: 'Reviewer', email: 'reviewer4@test.com' } }],
                },
            ];

            mockDocumentService.filterDocuments = jest.fn().mockResolvedValue(mockDocuments);
            mockDocumentService.updateDocument = jest
                .fn()
                .mockResolvedValueOnce(mockDocuments[0])
                .mockRejectedValueOnce(new Error('Update failed'));
            mockNotificationService.createWithTemplate = jest.fn().mockResolvedValue({});
            mockEmailService.sendMail = jest.fn().mockResolvedValue({});

            await documentReviewReminderJob();

            // First document should be processed successfully
            expect(mockDocumentService.updateDocument).toHaveBeenCalledWith('doc-success', {
                published: false,
                status: DocumentStatus.IN_REVIEW,
            });

            // Second document should fail but not crash the job
            expect(mockDocumentService.updateDocument).toHaveBeenCalledWith('doc-error', {
                published: false,
                status: DocumentStatus.IN_REVIEW,
            });
        });
    });
});
