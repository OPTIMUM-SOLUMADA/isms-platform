import { Request, Response } from 'express';
import { DocumentReviewService } from '@/services/documentreview.service';
import { DocumentVersionService } from '@/services/documentversion.service';
import { useGoogleDriveService } from '@/utils/google-drive';

const service = new DocumentReviewService();
const versionService = new DocumentVersionService();

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
            const allPending = await service.findPendingReviews();
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
            const { decision, comment } = req.body;

            const review = await service.findById(req.params.id!);
            if (!review) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_DOCUMENT_REVIEW_NOT_FOUND',
                });
                return;
            }

            const type = await service.submitReviewDecision(req.params.id!, {
                decision,
                comment,
                isCompleted: false,
            });
            return res.json(type);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async markAsCompleted(req: Request, res: Response) {
        try {
            const review = await service.findById(req.params.id!);

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

            const type = await service.markAsCompleted(req.params.id!);
            return res.json(type);
        } catch (error: any) {
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
                        dueDate: { gte: new Date() },
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
            const { userId, patchedVersion } = req.body;
            const gdService = useGoogleDriveService(req);
            const review = await service.findById(id!);
            if (!review) {
                return res.status(404).json({ error: 'Version not found' });
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
            await versionService.createPatchedVersion(data.documentId, {
                userId: userId,
                version: patchedVersion,
                googleDriveFileId: patchedFile.id!,
                fileUrl: patchedFile.webViewLink!,
            });

            return res.json(data);
        } catch (error: any) {
            console.log(error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    // Due soon
    async getMyReviewsDueSoon(req: Request, res: Response) {
        try {
            const { userId = '' } = req.params;
            const data = await service.getMyReviewsDueSoon(userId);
            return res.set('Content-Type', 'application/json').send(JSON.stringify(data, null, 2));

            return res.json(data);
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
}
