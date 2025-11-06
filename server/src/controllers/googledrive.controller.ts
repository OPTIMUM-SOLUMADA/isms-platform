import { Request, Response } from 'express';
import { google } from 'googleapis';
import { GoogleAuthConfig } from '@/configs/google.config';
import { GoogleDriveService } from '@/services/googledrive.service';
import { logger } from '@/utils/logger';
import { GoogleAccountService } from '@/services/google-account.service';
import { useGoogleDriveService } from '@/utils/google-drive';
import { DocumentVersionService } from '@/services/documentversion.service';
import { env } from '@/configs/env';
import { openDocumentInBrowser } from '@/utils/puppeteer';

const gAccountService = new GoogleAccountService();
const documentVersion = new DocumentVersionService();

export class GoogleDriveController {
    static async redirectToGoogle(req: Request, res: Response) {
        const oauth2Client = GoogleAuthConfig.getInstance().getClient();
        const scopes = ['https://www.googleapis.com/auth/drive', 'email', 'profile'];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes,
        });

        res.redirect(url);
    }

    static async handleGoogleCallback(req: Request, res: Response) {
        try {
            const code = req.query.code as string;
            const oauth2Client = GoogleAuthConfig.getInstance().getClient();
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
            const { data: userInfo } = await oauth2.userinfo.get();

            const driveService = new GoogleDriveService(tokens);

            // get Account if exists
            const existingAccount = await gAccountService.getLast();

            let workingDirId = '';

            if (existingAccount) {
                // Find working directory if exists
                const workingDir = await driveService.findFolderById(existingAccount.workingDirId!);
                workingDirId = workingDir?.id || '';
            } else {
                // Create working directory
                const workingDir = await driveService.createFolder(
                    env.GOOGLE_DRIVE_WORKING_FOLDER_NAME,
                );
                workingDirId = workingDir.id;
            }

            await gAccountService.create({
                email: userInfo.email!,
                googleId: userInfo.id!,
                tokens: tokens,
                workingDirId: workingDirId,
            });

            return res.redirect('/');
        } catch (error) {
            logger.error(error);
            res.status(500).json({ error: 'Google authentication failed' });
        }
    }

    static async listDriveFiles(req: Request, res: Response) {
        try {
            const user = (req.session as any)?.user;
            if (!user) return res.status(401).json({ error: 'Not authenticated' });

            const driveService = new GoogleDriveService(user.tokens);
            const files = await driveService.listFiles();

            return res.set('Content-Type', 'application/json').send(JSON.stringify(files, null, 2));
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Failed to list files' });
        }
    }

    static async grantPermissions(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const versions = await documentVersion.getByDocumentId(documentId!);

            const driveService = useGoogleDriveService(req);

            // Map each version to a Promise for parallel processing
            const tasks = versions.map(async (version) => {
                // Grant permissions
                const grantPromise = grantDocumentPermissions(version, driveService);

                // Open URL in Puppeteer (if exists)
                const openPromise = version.fileUrl
                    ? openDocumentInBrowser(version.fileUrl)
                    : Promise.resolve();

                // Run both concurrently
                await Promise.all([grantPromise, openPromise]);
            });

            await Promise.all(tasks);

            return res.status(200).json({ message: 'Permissions granted successfully' });
        } catch {
            return res.status(500).json({ error: 'Failed to grant permissions' });
        }
    }
}

async function grantDocumentPermissions(version: any, driveService: any) {
    const authorsEmail = version.document.authors.map((e: any) => e.user.email);
    const reviewersEmail = version.document.reviewers.map((e: any) => e.user.email);

    // Grant permissions
    await driveService.grantPermissions(version.googleDriveFileId, authorsEmail, 'writer');
    await driveService.grantPermissions(version.googleDriveFileId, reviewersEmail, 'commenter');
}
