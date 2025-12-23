import { Request, Response } from 'express';
import { DocumentService } from '@/services/document.service';
import { createVersion } from '@/utils/version';
import { FileService } from '@/services/file.service';
import path from 'path';
import { DOCUMENT_UPLOAD_PATH } from '@/configs/upload';
import { DepartmentRoleDocumentService } from '@/services/departmentrole-document.service';
import { readFileSync } from 'fs';
import { useGoogleDriveService } from '@/utils/google-drive';
import { DocumentVersionService } from '@/services/documentversion.service';
import { DocumentReviewService } from '@/services/documentreview.service';
import { RecentlyViewedService } from '@/services/recenltyview.service';
import { AuditEventType, Classification } from '@prisma/client';
import { openDocumentInBrowser } from '@/utils/puppeteer';
import { sanitizeDocument } from '@/utils/sanitize-document';
import { getChanges } from '@/utils/change';
import NotificationService from '@/services/notification.service';
import { calculateNextReviewDate } from '@/utils/dateCalculator';
import prisma from '@/database/prisma';
import { ComplianceService } from '@/services/compliance.service';

export class DocumentController {
    private service: DocumentService;
    private complianceService: ComplianceService;
    private departmentRoleDocument: DepartmentRoleDocumentService;
    private versionService: DocumentVersionService;
    private reviewService: DocumentReviewService;
    private recenltyViewed: RecentlyViewedService;


    constructor() {
        this.service = new DocumentService();
        this.departmentRoleDocument = new DepartmentRoleDocumentService();
        this.versionService = new DocumentVersionService();
        this.reviewService = new DocumentReviewService();
        this.recenltyViewed = new RecentlyViewedService();
        this.complianceService = new ComplianceService();
    }

    async create(req: Request, res: Response) {
        try {
            const {
                title,
                description,
                status,
                type,
                isoClause,
                reviewers,
                authors,
                reviewFrequency,
                owner,
                classification,
                departmentRoles,
            } = req.body;

            const file = req.file;

            if (!file) {
                throw new Error('File is required');
            }

            const version = createVersion(1, 0);

            const buffer = readFileSync(file.path);
            const googleDriveService = useGoogleDriveService(req);
            const workingDirId = googleDriveService.getWorkingDirId();

            // Create folder parent for the new document
            const folder = await googleDriveService.createFolder(title, [workingDirId]);

            // Upload to Google Drive
            const result = await googleDriveService.uploadFileFromBuffer(buffer, {
                name: `${title} - ${version}`,
                mimeType: file.mimetype,
                parents: [folder.id],
            });

            const fileUrl = req.file ? req.file.filename : null;

            const createdDoc = await this.service.createDocument({
                title,
                description,
                status,
                reviewFrequency,
                classification,
                ...(type && { type: { connect: { id: type } } }),
                ...(isoClause && { isoClause: { connect: { id: isoClause } } }),
                ...(owner && { owner: { connect: { id: owner } } }),
                fileUrl: fileUrl,
                // Create document version
                versions: {
                    create: {
                        version: version, // 1.0
                        isCurrent: true,
                        fileUrl: result.webViewLink,
                        downloadUrl: result.webContentLink,
                        googleDriveFileId: result.id,
                    },
                },
                folderId: folder.id,
            });

            // link document to users (Authors and Reviewers)
            await this.service.linkDocumentToUsers({
                documentId: createdDoc.id,
                reviewerIds: reviewers.split(','),
                authors: authors.split(','),
            });

            const createdCompliance = await this.complianceService.createClause( {
                documentId: createdDoc.id,
                isoClauseId: isoClause,
                status: 'NON_COMPLIANT',
                nextReview: createdDoc.nextReviewDate
            });
            

            // Send notifications to assigned users
            const authorIdsList = authors.split(',').filter((id: string) => id);
            const reviewerIdsList = reviewers.split(',').filter((id: string) => id);

            if (authorIdsList.length > 0 || reviewerIdsList.length > 0) {
                await NotificationService.notifyDocumentCreated({
                    documentId: createdDoc.id,
                    documentTitle: title,
                    authorIds: authorIdsList,
                    reviewerIds: reviewerIdsList,
                    creatorId: req.user?.id || '',
                });
            }

            // link departmentRoles to document
            this.departmentRoleDocument.createMany(
                departmentRoles.split(',').map((departmentRoleId: any) => ({
                    documentId: createdDoc.id,
                    departmentRoleId: departmentRoleId,
                })),
            );

            if (fileUrl) FileService.deleteFile(DOCUMENT_UPLOAD_PATH, fileUrl);

            const document = await this.service.getDocumentById(createdDoc.id);
            // Audit
            await req.log({
                event: AuditEventType.DOCUMENT_CREATE,
                status: 'SUCCESS',
                details: {
                    ...getChanges(sanitizeDocument(document!), {}),
                },
                targets: [{ id: createdDoc.id, type: 'DOCUMENT' }],
            });

            // Audit compliance creation
            await req.log({
                event: AuditEventType.COMPLIANCE_CREATE,
                status: 'SUCCESS',
                details: {
                    documentTitle: title,
                    complianceStatus: 'NON_COMPLIANT',
                    nextReview: createdDoc.nextReviewDate,
                },
                targets: [{ id: createdCompliance.id, type: 'COMPLIANCE' }],
            });
            
            res.status(201).json(createdDoc);
        } catch (err) {
            const fileUrl = req.file ? req.file.filename : null;
            if (fileUrl) FileService.deleteFile(DOCUMENT_UPLOAD_PATH, fileUrl);
            console.log(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const document = await this.service.getDocumentById(req.params.id!);
            if (!document) {
                res.status(404).json({
                    error: 'Document not found',
                    code: 'ERR_DOCUMENT_NOT_FOUND',
                });
            } else {
                res.json(document);
            }
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id: documentId } = req.params;
            const {
                title,
                description,
                status,
                authors,
                type,
                departmentRoles,
                isoClause,
                reviewers,
                reviewFrequency,
                owner,
                classification,
            } = req.body;

            // find document
            const document = await this.service.getDocumentById(documentId!);

            if (!document) {
                res.status(404).json({
                    error: 'Document not found',
                    code: 'ERR_DOCUMENT_NOT_FOUND',
                });
                return;
            }

            const googleDriveService = useGoogleDriveService(req);

            const file = req.file;

            // Replace file from google drive if user change the document
            if (file) {
                const currentVersion = document.versions.find((v) => v.isCurrent);
                if (!currentVersion) throw new Error('Current version not found');
                googleDriveService.deleteFile(currentVersion.googleDriveFileId);
                // re upload
                const buffer = readFileSync(file.path);
                const result = await googleDriveService.uploadFileFromBuffer(buffer, {
                    name: `${title} - ${currentVersion.version}`,
                    mimeType: file.mimetype,
                    parents: [document.folderId!],
                });

                // update version
                await this.service.update(documentId!, {
                    versions: {
                        update: {
                            where: {
                                id: currentVersion.id,
                                isCurrent: true,
                            },
                            data: {
                                fileUrl: result.webViewLink!,
                                googleDriveFileId: result.id!,
                            },
                        },
                    },
                });
            }

            // Update folder name if name changed
            if (title !== document.title) {
                await googleDriveService.updateFolderName(document.folderId!, title);
            }

            const updatedDocument = await this.service.update(documentId!, {
                ...(title && { title }),
                ...(description && { description }),
                // If document is APPROVED and being updated, reset to IN_REVIEW
                status: document.status === 'APPROVED' ? 'IN_REVIEW' : status || document.status,
                ...(reviewFrequency && { reviewFrequency }),
                ...(type && { type: { connect: { id: type } } }),
                ...(isoClause && { isoClause: { connect: { id: isoClause } } }),
                ...(owner && { owner: { connect: { id: owner } } }),
                ...(file && { fileUrl: file.filename }),
                classification,
            });

            // link departmentRoles to document
            this.departmentRoleDocument.reCreateMany(
                updatedDocument.id,
                departmentRoles.split(',').map((departmentRoleId: any) => ({
                    documentId: updatedDocument.id,
                    departmentRoleId: departmentRoleId,
                })),
            );

            // relink document to users (Authors and Reviewers)
            await this.service.reLinkDocumentToUsers({
                documentId: updatedDocument.id,
                reviewerIds: reviewers.split(','),
                authors: authors.split(','),
            });

            // Reset ALL existing reviews when document is updated (decision -> null = IN_REVIEW state)
            try {
                const currentVersion = updatedDocument.versions.find((v) => v.isCurrent);
                if (currentVersion) {
                    await prisma.documentReview.updateMany({
                        where: {
                            documentId: updatedDocument.id,
                            documentVersionId: currentVersion.id,
                        },
                        data: {
                            decision: null,
                            isCompleted: false,
                            completedAt: null,
                            reviewDate: null,
                        },
                    });
                }
            } catch (err) {
                console.log('Failed to reset review decisions', err);
            }

            // Check if document has been viewed by users
            const hasBeenViewed = await prisma.recentlyViewedDocument.count({
                where: { documentId: updatedDocument.id },
            });

            // If document was APPROVED and now IN_REVIEW, OR if document has been viewed, create review assignments
            const shouldCreateReviews =
                (document.status === 'APPROVED' && updatedDocument.status === 'IN_REVIEW') ||
                hasBeenViewed > 0;

            if (shouldCreateReviews) {
                try {
                    const currentVersion = updatedDocument.versions.find((v) => v.isCurrent);
                    const reviewerIdsArray = reviewers
                        ? reviewers.split(',').filter((id: string) => id)
                        : [];

                    if (reviewerIdsArray.length > 0 && currentVersion) {
                        // Calculate due date based on reviewFrequency
                        const reviewDueDate = updatedDocument.reviewFrequency
                            ? calculateNextReviewDate(updatedDocument.reviewFrequency)
                            : null;

                        // Use updateAssignedReviewersToDocument which already handles duplicates
                        await this.reviewService.updateAssignedReviewersToDocument({
                            documentId: updatedDocument.id,
                            documentVersionId: currentVersion.id,
                            reviewerIds: reviewerIdsArray,
                            ...(req.user?.id ? { userId: req.user.id } : {}),
                            dueDate: reviewDueDate,
                        });
                    }
                } catch (err) {
                    console.log('Failed to create document reviews', err);
                }
            }

            if (file) {
                // Delete old file
                await FileService.deleteFile(DOCUMENT_UPLOAD_PATH, document.fileUrl!);
            }

            const reGetUpdatedDocument = await this.service.getDocumentById(updatedDocument.id);

            // Send notifications to assigned users about document update
            const authorIdsList = authors.split(',').filter((id: string) => id);
            const reviewerIdsList = reviewers.split(',').filter((id: string) => id);

            if (authorIdsList.length > 0 || reviewerIdsList.length > 0) {
                await NotificationService.notifyDocumentUpdated({
                    documentId: updatedDocument.id,
                    documentTitle: reGetUpdatedDocument?.title || updatedDocument.title,
                    authorIds: authorIdsList,
                    reviewerIds: reviewerIdsList,
                    updaterId: req.user?.id || '',
                });
            }

            // Audit
            await req.log({
                event: AuditEventType.DOCUMENT_EDIT,
                status: 'SUCCESS',
                details: {
                    ...getChanges(
                        sanitizeDocument(document),
                        sanitizeDocument(reGetUpdatedDocument!),
                    ),
                },
                targets: [{ id: updatedDocument.id, type: 'DOCUMENT' }],
            });

            res.json(updatedDocument);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const deleted = await this.service.deleteDocument(req.params.id!);
            // Delete file
            await FileService.deleteFile(DOCUMENT_UPLOAD_PATH, deleted.fileUrl!);
            // Delete file from google drive
            const googleDriveService = useGoogleDriveService(req);
            const versionsIds = deleted.versions.map((version) => version.googleDriveFileId);
            await googleDriveService.deleteFiles(versionsIds);
            await googleDriveService.deleteFolder(deleted.folderId!);

            // Audit
            await req.log({
                event: AuditEventType.DOCUMENT_DELETE,
                status: 'SUCCESS',
                details: {
                    title: deleted.title,
                    authors: deleted.authors.map((a: any) => a.user?.name),
                },
                targets: [{ id: deleted.id, type: 'DOCUMENT' }],
            });

            res.status(204).json(deleted);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { limit = '50', page = '1' } = req.query;

            const documents = await this.service.listDocuments({
                limit: parseInt(limit as string),
                page: parseInt(page as string),
            });
            res.json(documents);
        } catch (err) {
            console.log('err', err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async getStatistics(req: Request, res: Response) {
        try {
            const statistics = await this.service.getDocumentStats();
            res.json(statistics);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async download(req: Request, res: Response) {
        try {
            const document = await this.service.getDocumentById(req.params.id!);
            if (!document) {
                res.status(404).json({ error: 'Document not found' });
            } else {
                const filePath = path.join(DOCUMENT_UPLOAD_PATH, document.fileUrl!);
                // Extract the extension from the original file
                const ext = path.extname(document.fileUrl!);

                const filename = `${document.title} ${document.versions.find((v) => v.isCurrent)?.version}${ext}`;

                // audit log
                await req.log({
                    event: AuditEventType.DOCUMENT_DOWNLOAD,
                    status: 'SUCCESS',
                    details: {
                        title: document.title,
                        version: document.versions.find((v) => v.isCurrent)?.version,
                    },
                    targets: [{ id: document.id, type: 'DOCUMENT' }],
                });

                res.download(filePath, filename);
            }
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async downloadFromGoogleDrive(req: Request, res: Response) {
        try {
            const document = await this.service.getDocumentById(req.params.id!);
            if (!document) {
                res.status(404).json({ error: 'Document not found' });
                return;
            }

            const gdService = useGoogleDriveService(req);

            // Use folderId as reference (assuming folderId stores the Google Drive fileId)
            const fileId = document.versions.find((v) => v.isCurrent)?.googleDriveFileId || '';

            const file = await gdService.getFileById(fileId);

            const driveFile = await gdService.getStreamFileById(fileId);

            // audit log
            await req.log({
                event: AuditEventType.DOCUMENT_DOWNLOAD,
                status: 'SUCCESS',
                details: {
                    title: document.title,
                    version: document.versions.find((v) => v.isCurrent)?.version,
                },
                targets: [{ id: document.id, type: 'DOCUMENT' }],
            });

            // Set minimal headers to prompt download
            res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
            res.setHeader('Content-Type', file.mimeType ?? 'application/octet-stream');

            driveFile
                .on('end', () => console.log(`File ${file.name} streamed successfully`))
                .on('error', (err) => {
                    console.error('Error streaming Google Drive file', err);
                    res.status(500).json({ error: 'Failed to download file' });
                })
                .pipe(res);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async publish(req: Request, res: Response) {
        try {
            // 1- Publish document
            const document = await this.service.publishDocument(req.params.id!);
            // 2- Check its classification and share it to anyone if Public
            if (document.classification === Classification.PUBLIC) {
                const gdService = useGoogleDriveService(req);
                await gdService.makeFilePublicReadable(document.folderId!);
                // Get current version
                const currentVersion = document.versions.find((v) => v.isCurrent)!;
                if (currentVersion)
                    // open it to avoid permission error
                    await openDocumentInBrowser(currentVersion.fileUrl!);
            }

            // 3- Send notifications
            await NotificationService.notifyDocumentPublished({
                documentId: document.id,
                documentTitle: document.title,
                documentClassification: document.classification,
                ...(req.user?.id && { creatorId: req.user.id }),
            });

            res.json(document);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async unpublish(req: Request, res: Response) {
        try {
            const document = await this.service.unpublishDocument(req.params.id!);
            // 2- Check its classification and share it to anyone if Public
            if (document.classification === Classification.PUBLIC) {
                const gdService = useGoogleDriveService(req);
                await gdService.makeFileUnreadable(document.folderId!);
                // Get current version
                const currentVersion = document.versions.find((v) => v.isCurrent)!;
                if (currentVersion)
                    // open it to avoid permission error
                    await openDocumentInBrowser(currentVersion.fileUrl!);
            }
            res.json(document);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async createDraftDocumentVersion(req: Request, res: Response) {
        try {
            const { id: reviewId } = req.params;

            const review = await this.reviewService.findByIdWithIncludedData(reviewId!);
            if (!review) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_REVIEW_NOT_FOUND',
                });
                return;
            }

            if (review.isCompleted) {
                res.status(400).json({
                    error: 'Review already completed',
                    code: 'ERR_REVIEW_ALREADY_COMPLETED',
                });
                return;
            }

            // const documentId = review.documentId;

            // const version = await this.versionService.getCurrentVersionByDocumentId(documentId!);
            const version = await this.versionService.getById(review.documentVersionId!);
            if (!version) {
                res.status(404).json({
                    error: 'Version not found',
                    code: 'ERR_VERSION_NOT_FOUND',
                });
                return;
            }

            if (version.draftUrl || version.draftId) {
                res.json(version);
                return;
            }

            const gdService = useGoogleDriveService(req);

            // Use folderId as reference (assuming folderId stores the Google Drive fileId)
            const fileId = version.googleDriveFileId;

            const draft = await gdService.duplicateFile(fileId, {
                name: `Draft - ${version.document.title} - ${version.version}`,
                parentId: version.document.folderId!,
            });

            // Grant permissions to authors
            await gdService.grantPermissions(
                draft.id!,
                version.document.authors.map((a) => a.user.email),
                'writer',
            );

            // Grant permissions to reviewers
            await gdService.grantPermissions(
                draft.id!,
                version.document.reviewers.map((r) => r.user.email),
                'commenter',
            );

            const updatedVersion = await this.versionService.update(version.id, {
                draftUrl: draft.webViewLink!,
                draftId: draft.id!,
            });

            res.json(updatedVersion);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async getPublishedDocumentsUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const document = await this.service.getPublishedDocumentsByUserId(userId!);
            res.json(document);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    // Add document to recent view
    async addDocumentToRecentView(req: Request, res: Response) {
        try {
            const { documentId, userId } = req.params;
            const document = await this.recenltyViewed.markDocumentAsViewed(userId!, documentId!);
            res.json(document);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async getRecentlyViewed(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const document = await this.recenltyViewed.getByUser(userId!);
            res.json(document);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }
}
