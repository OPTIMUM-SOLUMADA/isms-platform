import { DocumentVersionService } from '@/services/documentversion.service';
import { useGoogleDriveService } from '@/utils/google-drive';
import { Request, Response } from 'express';

export class VersionController {
    private service: DocumentVersionService;

    constructor() {
        this.service = new DocumentVersionService();
    }

    async getVersionsByDocumentId(req: Request, res: Response) {
        try {
            const versions = await this.service.getByDocumentId(req.params.documentId!);
            res.json(versions);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to get versions' });
        }
    }

    async downloadFromGoogleDrive(req: Request, res: Response) {
        try {
            const version = await this.service.getById(req.params.id!);
            if (!version) {
                res.status(404).json({ error: 'Version not found' });
                return;
            }

            const gdService = useGoogleDriveService(req);

            // Use folderId as reference (assuming folderId stores the Google Drive fileId)
            const fileId = version.googleDriveFileId || '';

            const file = await gdService.getFileById(fileId);

            const driveFile = await gdService.getStreamFileById(fileId);

            // Set minimal headers to prompt download
            res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
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
}
