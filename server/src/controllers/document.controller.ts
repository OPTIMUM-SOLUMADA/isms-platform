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
// eslint-disable-next-line import/no-named-as-default
import NotificationService from '@/services/notification.service';
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
                version: versionInput,
                documentDate,
            } = req.body;

            const file = req.file;

            console.log('[POST /documents] body:', req.body);

            if (!file) {
                throw new Error('File is required');
            }

            const version = versionInput || createVersion(1, 0);

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

            const previewUrl = `https://drive.google.com/file/d/${result.id}/preview`;

            const fileUrl = req.file ? req.file.filename : null;

            const createdDoc = await this.service.createDocument({
                title,
                description,
                status,
                classification,
                ...(reviewFrequency && { reviewFrequency }),
                ...(documentDate && { documentDate: new Date(documentDate) }),
                ...(type && { type: { connect: { id: type } } }),
                ...(isoClause && { isoClause: { connect: { id: isoClause } } }),
                ...(owner && { owner: { connect: { id: owner } } }),
                fileUrl: fileUrl,
                versions: {
                    create: {
                        version,
                        isCurrent: true,
                        fileUrl: result.webViewLink,
                        downloadUrl: result.webContentLink,
                        googleDriveFileId: result.id,
                    },
                },
                folderId: folder.id,
            });

            // Parse and clean user IDs
            const authorIdsList = authors
                .split(',')
                .map((id: string) => id.trim())
                .filter((id: string) => id);
            const reviewerIdsList = reviewers
                .split(',')
                .map((id: string) => id.trim())
                .filter((id: string) => id);

            // link document to users (Authors and Reviewers)
            await this.service.linkDocumentToUsers({
                documentId: createdDoc.id,
                reviewerIds: reviewerIdsList,
                authors: authorIdsList,
            });

            // Get the updated document with authors and reviewers
            const documentWithUsers = await this.service.getDocumentById(createdDoc.id);

            // Grant Google Drive permissions to authors and reviewers
            if (documentWithUsers) {
                const authorsEmail = documentWithUsers.authors
                    .map((a: any) => a.user.email)
                    .filter(Boolean);
                const reviewersEmail = documentWithUsers.reviewers
                    .map((r: any) => r.user.email)
                    .filter(Boolean);

                // Grant permissions to authors (writer) and reviewers (commenter)
                try {
                    if (authorsEmail.length > 0) {
                        await googleDriveService.grantPermissions(result.id, authorsEmail, 'writer');
                    }
                    if (reviewersEmail.length > 0) {
                        await googleDriveService.grantPermissions(
                            result.id,
                            reviewersEmail,
                            'commenter',
                        );
                    }
                    // Make file viewable with link to enable preview in emails/embeds
                    await googleDriveService.makeFileViewableWithLink(result.id);
                } catch (permError) {
                    console.warn('Failed to grant Drive permissions, document still created:', permError);
                }
            }

            const createdCompliance = await this.complianceService.createClause({
                documentId: createdDoc.id,
                isoClauseId: isoClause,
                status: 'NON_COMPLIANT',
                nextReview: createdDoc.nextReviewDate,
            });

            // Send notifications to assigned users (using already cleaned IDs)
            if (authorIdsList.length > 0 || reviewerIdsList.length > 0) {
                await NotificationService.notifyDocumentCreated({
                    documentId: createdDoc.id,
                    documentTitle: title,
                    authorIds: authorIdsList,
                    reviewerIds: reviewerIdsList,
                    ...((req.user as any)?.id && { creatorId: (req.user as any).id }),
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
            await req.log?.({
                event: AuditEventType.DOCUMENT_CREATE,
                status: 'SUCCESS',
                details: {
                    ...getChanges(sanitizeDocument(document!), {}),
                },
                targets: [{ id: createdDoc.id, type: 'DOCUMENT' }],
            });

            // Audit compliance creation
            await req.log?.({
                event: AuditEventType.COMPLIANCE_CREATED,
                status: 'SUCCESS',
                details: {
                    documentTitle: title,
                    complianceStatus: 'NON_COMPLIANT',
                    // nextReview: createdDoc.nextReviewDate,
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
                version: versionInput,
                documentDate,
                reviewDueDate,
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
                ...(documentDate && { documentDate: new Date(documentDate) }),
                ...(type && { type: { connect: { id: type } } }),
                ...(isoClause && { isoClause: { connect: { id: isoClause } } }),
                ...(owner && { owner: { connect: { id: owner } } }),
                ...(file && { fileUrl: file.filename }),
                classification,
            });

            // Update version string on current version if provided
            if (versionInput) {
                const currentVersion = updatedDocument.versions.find((v) => v.isCurrent);
                if (currentVersion) {
                    await this.versionService.update(currentVersion.id, { version: versionInput });
                }
            }

            // link departmentRoles to document
            this.departmentRoleDocument.reCreateMany(
                updatedDocument.id,
                departmentRoles.split(',').map((departmentRoleId: any) => ({
                    documentId: updatedDocument.id,
                    departmentRoleId: departmentRoleId,
                })),
            );

            // Parse and clean user IDs
            const updatedAuthorIdsList = authors
                .split(',')
                .map((id: string) => id.trim())
                .filter((id: string) => id);
            const updatedReviewerIdsList = reviewers
                .split(',')
                .map((id: string) => id.trim())
                .filter((id: string) => id);

            // relink document to users (Authors and Reviewers)
            await this.service.reLinkDocumentToUsers({
                documentId: updatedDocument.id,
                reviewerIds: updatedReviewerIdsList,
                authors: updatedAuthorIdsList,
            });

            // Get the updated document with authors and reviewers to grant permissions
            const documentWithUsers = await this.service.getDocumentById(updatedDocument.id);

            // Grant Google Drive permissions to authors and reviewers for the current version
            if (documentWithUsers) {
                const currentVersion = documentWithUsers.versions.find((v) => v.isCurrent);
                if (currentVersion?.googleDriveFileId) {
                    const authorsEmail = documentWithUsers.authors
                        .map((a: any) => a.user.email)
                        .filter(Boolean);
                    const reviewersEmail = documentWithUsers.reviewers
                        .map((r: any) => r.user.email)
                        .filter(Boolean);

                    // Grant permissions to authors (writer) and reviewers (commenter)
                    if (authorsEmail.length > 0) {
                        await googleDriveService.grantPermissions(
                            currentVersion.googleDriveFileId,
                            authorsEmail,
                            'writer',
                        );
                    }
                    if (reviewersEmail.length > 0) {
                        await googleDriveService.grantPermissions(
                            currentVersion.googleDriveFileId,
                            reviewersEmail,
                            'commenter',
                        );
                    }

                    // Make file viewable with link to enable preview in emails/embeds
                    await googleDriveService.makeFileViewableWithLink(
                        currentVersion.googleDriveFileId,
                    );
                }
            }

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
                        await this.reviewService.updateAssignedReviewersToDocument({
                            documentId: updatedDocument.id,
                            documentVersionId: currentVersion.id,
                            reviewerIds: reviewerIdsArray,
                            ...((req.user as any)?.id ? { userId: (req.user as any).id } : {}),
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
            if (updatedAuthorIdsList.length > 0 || updatedReviewerIdsList.length > 0) {
                await NotificationService.notifyDocumentUpdated({
                    documentId: updatedDocument.id,
                    documentTitle: reGetUpdatedDocument?.title || updatedDocument.title,
                    authorIds: updatedAuthorIdsList,
                    reviewerIds: updatedReviewerIdsList,
                    ...((req.user as any)?.id && { updaterId: (req.user as any).id }),
                });
            }

            // Audit
            await req.log?.({
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
            await req.log?.({
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
                await req.log?.({
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
            await req.log?.({
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
                const currentVersion = document.versions.find((v) => v.isCurrent)!;
                if (currentVersion) {
                    try {
                        await openDocumentInBrowser(currentVersion.fileUrl!);
                    } catch (err) {
                        console.warn('openDocumentInBrowser failed (non-blocking):', err);
                    }
                }
            }

            // 3- Send notifications
            await NotificationService.notifyDocumentPublished({
                documentId: document.id,
                documentTitle: document.title,
                documentClassification: document.classification,
                ...((req.user as any)?.id && { creatorId: (req.user as any).id }),
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
                const currentVersion = document.versions.find((v) => v.isCurrent)!;
                if (currentVersion) {
                    try {
                        await openDocumentInBrowser(currentVersion.fileUrl!);
                    } catch (err) {
                        console.warn('openDocumentInBrowser failed (non-blocking):', err);
                    }
                }
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

            // Make draft viewable with link to enable preview in emails/embeds
            await gdService.makeFileViewableWithLink(draft.id!);

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

    /**
     * Get a user-specific Google Drive link for a document
     * This ensures the document opens in the user's Google account (the one they're logged in with on the site)
     */
    async getUserSpecificDriveLink(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const { userEmail } = req.query;

            if (!userEmail || typeof userEmail !== 'string') {
                return res.status(400).json({ error: 'User email is required' });
            }

            const document = await this.service.getDocumentById(documentId!);
            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            const currentVersion = document.versions.find((v) => v.isCurrent);
            if (!currentVersion?.googleDriveFileId) {
                return res.status(404).json({ error: 'Document version not found' });
            }

            const googleDriveService = useGoogleDriveService(req);
            const userSpecificLink = googleDriveService.getWebViewLinkForUser(
                currentVersion.googleDriveFileId,
                userEmail,
            );

            return res.json({
                link: userSpecificLink,
                fileId: currentVersion.googleDriveFileId,
                userEmail,
            });
        } catch (err) {
            return res.status(500).json({ error: (err as Error).message });
        }
    }

    /**
     * Get preview URL for a document version (optimized for iframe embedding)
     * Supports both document ID and version ID
     */
    async getDocumentPreviewUrl(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { versionId, userEmail } = req.query;

            // Try to get document first
            const document = await this.service.getDocumentById(id!);
            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            // Get the appropriate version
            let targetVersion;
            if (versionId && typeof versionId === 'string') {
                targetVersion = document.versions.find((v) => v.id === versionId);
            } else {
                targetVersion = document.versions.find((v) => v.isCurrent);
            }

            if (!targetVersion?.googleDriveFileId) {
                return res.status(404).json({ error: 'Document version not found' });
            }

            const googleDriveService = useGoogleDriveService(req);
            
            // Generate preview URL (with or without user-specific auth)
            const previewUrl = userEmail && typeof userEmail === 'string'
                ? googleDriveService.getPreviewLinkForUser(targetVersion.googleDriveFileId, userEmail)
                : googleDriveService.getPreviewLink(targetVersion.googleDriveFileId);

            const downloadUrl = googleDriveService.getWebContentLink(targetVersion.googleDriveFileId);

            return res.json({
                previewUrl,
                downloadUrl,
                fileId: targetVersion.googleDriveFileId,
                version: targetVersion.version,
            });
        } catch (err) {
            console.error('Error getting document preview URL:', err);
            return res.status(500).json({ error: (err as Error).message });
        }
    }
}
