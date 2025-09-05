import { Request, Response } from 'express';
import { DocumentService } from '@/services/document.service';
import { createVersion } from '@/utils/version';
import { FileService } from '@/services/file.service';
import path from 'path';
import { DOCUMENT_UPLOAD_PATH } from '@/configs/upload';
import { DocumentReviewService } from '@/services/documentreview.service';

export class DocumentController {
    private service: DocumentService;
    private reviewService: DocumentReviewService;

    constructor() {
        this.service = new DocumentService();
        this.reviewService = new DocumentReviewService();
    }

    async create(req: Request, res: Response) {
        try {
            const {
                title,
                description,
                status,
                type,
                department,
                isoClause,
                reviewers,
                owners,
                reviewFrequency,
            } = req.body;

            console.log(req.body);

            const fileUrl = req.file ? req.file.filename : null;

            const createdDoc = await this.service.createDocumentWithOwnersAndReviewers(
                {
                    title,
                    description,
                    status,
                    reviewFrequency,
                    ...(type && { type: { connect: { id: type } } }),
                    ...(department && { department: { connect: { id: department } } }),
                    ...(isoClause && { isoClause: { connect: { id: isoClause } } }),
                    fileUrl: fileUrl,
                    // create document version
                    versions: {
                        create: {
                            version: createVersion(1, 0), // 1.0
                            isCurrent: true,
                            fileUrl: fileUrl,
                        },
                    },
                },
                owners.split(','),
                reviewers.split(','),
            );

            // Assign reviews to reviewers
            if (createdDoc && createdDoc.reviewers.length > 0) {
                await this.reviewService.assignReviewersToDocument(
                    createdDoc.id,
                    reviewers.split(','),
                );
            }

            res.status(201).json(createdDoc);
        } catch (err) {
            const fileUrl = req.file ? req.file.filename : null;
            if (fileUrl) FileService.deleteFile(DOCUMENT_UPLOAD_PATH, fileUrl);
            console.log(err);
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const document = await this.service.getDocumentById(req.params.id!);
            if (!document) {
                res.status(404).json({ error: 'Document not found' });
            } else {
                res.json(document);
            }
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id: documentId } = req.params;
            const {
                title,
                description,
                status,
                owners,
                type,
                department,
                isoClause,
                reviewers,
                reviewFrequency,
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

            const fileUrl = req.file ? req.file.filename : undefined;

            const updatedDocument = await this.service.updateDocumentWithOwnersAndReviewers(
                documentId!,
                {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(status && { status }),
                    ...(reviewFrequency && { reviewFrequency }),
                    ...(type && { type: { connect: { id: type } } }),
                    ...(department && { department: { connect: { id: department } } }),
                    ...(isoClause && { isoClause: { connect: { id: isoClause } } }),
                    ...(fileUrl && { fileUrl }),
                },
                owners.split(','),
                reviewers.split(','),
            );

            if (fileUrl) {
                // Delete old file
                await FileService.deleteFile(DOCUMENT_UPLOAD_PATH, document.fileUrl!);
            }

            res.json(updatedDocument);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const deleted = await this.service.deleteDocument(req.params.id!);
            // Delete file
            await FileService.deleteFile(DOCUMENT_UPLOAD_PATH, deleted.fileUrl!);

            res.status(204).json(deleted);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: (err as Error).message });
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
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async getStatistics(req: Request, res: Response) {
        try {
            const statistics = await this.service.getDocumentStats();
            res.json(statistics);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
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
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async publish(req: Request, res: Response) {
        try {
            const document = await this.service.publishDocument(req.params.id!);
            res.json(document);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async unpublish(req: Request, res: Response) {
        try {
            const document = await this.service.unpublishDocument(req.params.id!);
            res.json(document);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}
