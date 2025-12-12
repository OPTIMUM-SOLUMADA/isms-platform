import { Request, Response } from 'express';
import { DocumentReviewService } from '@/services/documentreview.service';
import { DocumentVersionService } from '@/services/documentversion.service';
import { useGoogleDriveService } from '@/utils/google-drive';
import { DocumentApprovalService } from '@/services/documentapproval.service';
import { DocumentService } from '@/services/document.service';
import { AuditEventType, AuditTargetType } from '@prisma/client';
import { stripHtmlAndClamp } from '@/utils/review';
import { getChanges } from '@/utils/change';
import { sanitizeDocument } from '@/utils/sanitize-document';
import NotificationService from '@/services/notification.service';

const service = new DocumentReviewService();
const versionService = new DocumentVersionService();
const approvalService = new DocumentApprovalService();
const documentService = new DocumentService();

export class DocumentReviewController {
    async create(req: Request, res: Response) {
        try {
            const { document, dueDate, reviewer, versionId } = req.body;
            const clause = await service.create({
                document: { connect: { id: document } },
                reviewer: { connect: { id: reviewer } },
                documentVersion: { connect: { id: versionId } },
                reviewDate: dueDate,
            });
            return res.status(201).json(clause);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(_req: Request, res: Response) {
        try {
            const types = await service.findAll();
            return res.json(types);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async findPendingReviews(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const allPending = await service.findPendingReviews(userId);
            return res.json(allPending);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const type = await service.update(req.params.id!, req.body);

            return res.json(type);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const type = await service.findByIdWithIncludedData(req.params.id!);
            if (!type) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_DOCUMENT_REVIEW_NOT_FOUND',
                });
                return;
            }
            return res.json(type);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async makeDecision(req: Request, res: Response) {
        try {
            const { id: reviewId } = req.params;
            const { decision, comment } = req.body;

            const review = await service.findById(reviewId!);
            if (!review) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_DOCUMENT_REVIEW_NOT_FOUND',
                });
                return;
            }

            const type = await service.submitReviewDecision(reviewId!, {
                decision,
                comment,
            });

            // Audit for decision made
            await req.log({
                event: AuditEventType.DOCUMENT_REVIEW_SUBMITTED,
                targets: [
                    { type: AuditTargetType.REVIEW, id: reviewId! },
                    { type: AuditTargetType.DOCUMENT, id: review.documentId },
                ],
                details: { decision, comment: stripHtmlAndClamp(comment, 200) },
                status: 'SUCCESS',
            });

            // Notification: Review completed - notify assigner/owner
            if (review.assignedById) {
                await NotificationService.create({
                    user: { connect: { id: review.assignedById } },
                    type: 'REVIEW_COMPLETED',
                    title: `Revue complétée : ${review.document.title}`,
                    message: `La revue pour "${review.document.title}" a été complétée par ${req.user?.name || 'un utilisateur'}.`,
                    document: { connect: { id: review.documentId } },
                } as any);
            }

            return res.json(type);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async markAsCompleted(req: Request, res: Response) {
        try {
            const { id: reviewId } = req.params;
            const { userId } = req.body;

            const review = await service.findById(reviewId!);

            if (!review) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_DOCUMENT_REVIEW_NOT_FOUND',
                });
                return;
            }

            if (review.isCompleted) {
                res.status(400).json({ error: 'Document review already completed' });
                return;
            }

            const document = await documentService.getDocumentById(review.document.id!);

            // 1 - CREATE APPROVAL
            await approvalService.create({
                document: { connect: { id: review.document.id! } },
                version: { connect: { id: review.documentVersion.id! } },
                approver: { connect: { id: userId } },
                approvedAt: new Date(),
            });

            // 2 - UPDATE DOCUMENT STATUS
            const updatedDocument = await documentService.update(review.document.id!, {
                status: 'APPROVED',
            });

            // 3 - MARK REVIEW AS COMPLETED
            const type = await service.markAsCompleted(reviewId!);

            // 4 - Audit
            const changes = getChanges(
                sanitizeDocument(document),
                sanitizeDocument(updatedDocument),
            );

            await req.log({
                event: AuditEventType.DOCUMENT_VERSION_APPROVED,
                targets: [
                    { type: AuditTargetType.REVIEW, id: reviewId! },
                    { type: AuditTargetType.DOCUMENT, id: review.documentId },
                    { type: AuditTargetType.VERSION, id: review.documentVersion.id! },
                ],
                details: {
                    ...(changes && { document: changes }),
                },
                status: 'SUCCESS',
            });

            // // Notification: Version approved - notify document owner/authors
            // await NotificationService.create({
            //     user: { connect: { id: document!.ownerId } },
            //     type: 'VERSION_APPROVED',
            //     title: `Version approuvée : ${document!.title}`,
            //     message: `La version du document "${document!.title}" a été approuvée.`,
            //     document: { connect: { id: review.documentId } },
            // } as any);

            return res.json(type);
        } catch (error: any) {
            console.error(error);
            return res.status(400).json({ error: error.message });
        }
    }

    async getMyReviews(req: Request, res: Response) {
        try {
            const { userId = '' } = req.params;
            const { page = '1', limit = '50', status = 'ALL' } = req.query;
            const data = await service.getReviewsByUserId({
                userId,
                page: Number(page),
                limit: Number(limit),
                filter: {
                    ...(status === 'ALL' && {}),
                    ...(status === 'PENDING' && {
                        isCompleted: false,
                        decision: { isSet: false },
                        OR: [{ dueDate: { isSet: false } }, { dueDate: { gte: new Date() } }],
                    }),
                    ...(status === 'EXPIRED' && {
                        isCompleted: false,
                        decision: { isSet: false },
                        dueDate: { lte: new Date() },
                    }),
                    ...(status === 'APPROVED' && {
                        isCompleted: false,
                        decision: 'APPROVE',
                    }),
                    ...(status === 'REJECTED' && {
                        isCompleted: false,
                        decision: 'REJECT',
                        comment: { not: '' },
                    }),
                    ...(status === 'COMPLETED' && {
                        isCompleted: true,
                        decision: { isSet: true },
                    }),
                },
            });

            return res.json({
                reviews: data.data,
                pagination: {
                    total: data.total,
                    limit: data.limit,
                    page: data.page,
                    totalPages: data.totalPages,
                },
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getMyReviewsAndApproved(req: Request, res: Response) {
        try {
            const { userId = '' } = req.params;
            const { page = '1', limit = '50', status= "ALL" } = req.query;
            const data = await service.getReviewsAndApprovedByUserId({
                userId,
                page: Number(page),
                limit: Number(limit),
                filter: {
                    ...(status === 'ALL' && {}),
                    ...(status === 'PENDING' && {
                        isCompleted: false,
                        decision: { isSet: false },
                        OR: [{ dueDate: { isSet: false } }, { dueDate: { gte: new Date() } }],
                    }),
                    ...(status === 'EXPIRED' && {
                        isCompleted: false,
                        decision: { isSet: false },
                        dueDate: { lte: new Date() },
                    }),
                    ...(status === 'APPROVED' && {
                        isCompleted: false,
                        decision: 'APPROVE',
                    }),
                    ...(status === 'REJECTED' && {
                        isCompleted: false,
                        decision: 'REJECT',
                        comment: { not: '' },
                    }),
                    ...(status === 'COMPLETED' && {
                        isCompleted: true,
                        decision: { isSet: true },
                    }),
                },
            });
            return res.json({
                reviews: data.data,
                pagination: {
                    total: data.total,
                    limit: data.limit,
                    page: data.page,
                    totalPages: data.totalPages,
                },
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }  
    }

    async getMyReviewsStats(req: Request, res: Response) {
        try {
            const { userId = '' } = req.params;
            const data = await service.getReviewStatsByUserId(userId);
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async patchReview(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId, patchedVersion, comment = '' } = req.body;
            const gdService = useGoogleDriveService(req);
            const review = await service.findById(id!);

            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }

            if (review.isCompleted) {
                return res.status(400).json({ error: 'Review already completed' });
            }

            // 1 - Create the patched version file on google drive (by renaming the draft file)
            const patchedFile = await gdService.updateFileName(
                review.documentVersion.draftId!,
                `${review.document.title} - ${patchedVersion}`,
            );

            // 2 - Remove draft fields from version
            await versionService.update(review.documentVersion.id!, {
                draftUrl: null,
                draftId: null,
            });

            // 3 - Complete review
            const data = await service.update(id!, {
                isCompleted: true,
                completedAt: new Date(),
                completedBy: { connect: { id: userId } },
            });

            // 4 - Create new version of the doc and mark it as current
            const newVersion = await versionService.createPatchedVersion(data.documentId, {
                userId: userId,
                version: patchedVersion,
                googleDriveFileId: patchedFile.id!,
                fileUrl: patchedFile.webViewLink!,
                comment,
            });

            // 6 - Create new review for the new version
            const newReview = await service.create({
                document: { connect: { id: data.documentId } },
                documentVersion: { connect: { id: newVersion.id } },
                reviewer: { connect: { id: review.reviewerId } },
                createdAt: new Date(),
            });

            // 7 - Notify reviewers
            await service.sendReviewNotification(newReview);

            // 8 - Update document status
            await documentService.update(data.documentId, { status: 'IN_REVIEW' });

            // 10 - Audit log
            await req.log({
                event: AuditEventType.DOCUMENT_VERSION_CREATED,
                targets: [
                    { type: AuditTargetType.REVIEW, id: id! },
                    { type: AuditTargetType.DOCUMENT, id: data.documentId },
                    { type: AuditTargetType.VERSION, id: newVersion.id },
                ],
                details: { comment: stripHtmlAndClamp(comment, 200) },
                status: 'SUCCESS',
            });

            return res.json(data);
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    // Due soon
    async getMyReviewsDueSoon(req: Request, res: Response) {
        try {
            const { userId = '' } = req.params;
            const data = await service.getMyReviewsDueSoon(userId);
            return res.set('Content-Type', 'application/json').send(JSON.stringify(data, null, 2));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getSubmittedReviewsByDocument(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const data = await service.getSubmittedReviewsByDocument(documentId!);
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getCompletedReviewsByDocument(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const data = await service.getCompletedReviewsByDocument(documentId!);
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getExpiredReviewsByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const data = await service.getExpiredReviewsByUser(userId!);
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getMyExpiredAndDueSoonReviews(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const data = await service.getExpiredAndDueSoonReviewsByUser(userId!);
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getOtherUsersReviews(req: Request, res: Response) {
        try {
            const { documentId, versionId } = req.params;
            const data = await service.getOtherUsersReviews(documentId!, versionId!);
            return res.json(data);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
