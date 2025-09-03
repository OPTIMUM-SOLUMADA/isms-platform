import { Request, Response } from 'express';
import { DocumentService } from '@/services/document.service';
import { createVersion } from '@/utils/version';
import { FileService } from '@/services/file.service';
import path from 'path';
import { DOCUMENT_UPLOAD_PATH } from '@/configs/upload';

const service = new DocumentService();

export class DocumentController {
    async create(req: Request, res: Response) {
        try {
            const { title, description, status, owner, type, department, isoClause, reviewers } =
                req.body;

            const fileUrl = req.file ? req.file.filename : null;

            const document = await service.createDocument({
                title,
                description,
                status,
                ...(owner && { owner: { connect: { id: owner } } }),
                ...(type && { type: { connect: { id: type } } }),
                ...(department && { department: { connect: { id: department } } }),
                ...(isoClause && { isoClause: { connect: { id: isoClause } } }),
                reviewersId: reviewers.split(','),
                fileUrl: fileUrl,
                // create document version
                versions: {
                    create: {
                        version: createVersion(1, 0), // 1.0
                        isCurrent: true,
                    },
                },
            });

            res.status(201).json(document);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const document = await service.getDocumentById(req.params.id!);
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
            const { title, description, status, owner, type, department, isoClause, reviewers } =
                req.body;

            // find document
            const document = await service.getDocumentById(documentId!);

            if (!document) {
                res.status(404).json({
                    error: 'Document not found',
                    code: 'ERR_DOCUMENT_NOT_FOUND',
                });
                return;
            }

            const fileUrl = req.file ? req.file.filename : undefined;

            const updatedDocument = await service.updateDocument(documentId!, {
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status }),
                ...(owner && { owner: { connect: { id: owner } } }),
                ...(type && { type: { connect: { id: type } } }),
                ...(department && { department: { connect: { id: department } } }),
                ...(isoClause && { isoClause: { connect: { id: isoClause } } }),
                ...(reviewers && { reviewersId: reviewers.split(',') }),
                ...(fileUrl && { fileUrl }),
            });

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
            const deleted = await service.deleteDocument(req.params.id!);
            // Delete file
            await FileService.deleteFile(DOCUMENT_UPLOAD_PATH, deleted.fileUrl!);

            res.status(204).json(deleted);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { limit = '50', page = '1' } = req.query;

            const documents = await service.listDocuments({
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
            const statistics = await service.getDocumentStats();
            res.json(statistics);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async download(req: Request, res: Response) {
        try {
            const document = await service.getDocumentById(req.params.id!);
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
}
