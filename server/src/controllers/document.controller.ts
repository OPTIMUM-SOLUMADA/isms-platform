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

export class DocumentController {
    private service: DocumentService;
    private departmentRoleDocument: DepartmentRoleDocumentService;
    private versionService: DocumentVersionService;
    private reviewService: DocumentReviewService;

    constructor() {
        this.service = new DocumentService();
        this.departmentRoleDocument = new DepartmentRoleDocumentService();
        this.versionService = new DocumentVersionService();
        this.reviewService = new DocumentReviewService();
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

            // link departmentRoles to document
            this.departmentRoleDocument.createMany(
                departmentRoles.split(',').map((departmentRoleId: any) => ({
                    documentId: createdDoc.id,
                    departmentRoleId: departmentRoleId,
                })),
            );

            if (fileUrl) FileService.deleteFile(DOCUMENT_UPLOAD_PATH, fileUrl);

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
                const [originalname, ext] = file.originalname.split('.');
                const result = await googleDriveService.uploadFileFromBuffer(buffer, {
                    name: `${originalname}-${createVersion(1, 0)}.${ext}`,
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
                ...(status && { status }),
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

            if (file) {
                // Delete old file
                await FileService.deleteFile(DOCUMENT_UPLOAD_PATH, document.fileUrl!);
            }

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

            // Set minimal headers to prompt download
            res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
            res.setHeader('Content-Type', 'application/octet-stream');

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
            const document = await this.service.publishDocument(req.params.id!);
            res.json(document);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async unpublish(req: Request, res: Response) {
        try {
            const document = await this.service.unpublishDocument(req.params.id!);
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
                res.status(404).json({ error: 'Review not found' });
                return;
            }

            const documentId = review.documentId;

            const version = await this.versionService.getCurrentVersionByDocumentId(documentId!);
            if (!version) {
                res.status(404).json({ error: 'Document not found' });
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
}
