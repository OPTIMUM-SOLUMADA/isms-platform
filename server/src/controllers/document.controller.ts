import { Request, Response } from 'express';
import { DocumentService } from '@/services/document.service';
import { createVersion } from '@/utils/version';
import { FileService } from '@/services/file.service';
import { DOCUMENT_UPLOAD_PATH } from '@/configs/multer/document-multer';

const service = new DocumentService();

export class DocumentController {
    async create(req: Request, res: Response) {
        try {
            const {
                title,
                description,
                status,
                owner,
                type,
                department,
                isoClause,
                reviewers,
            } = req.body;

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
                    }
                }
            });

            res.status(201).json(document);
        } catch (err) {
            console.log(err)
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
            const updated = await service.updateDocument(req.params.id!, req.body);
            res.json(updated);
        } catch (err) {
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
            const documents = await service.listDocuments();
            res.json(documents);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}
