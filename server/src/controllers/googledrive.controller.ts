import { Request, Response } from 'express';
import { google } from 'googleapis';
import { GoogleAuthConfig } from '@/configs/google.config';
import { GoogleDriveService } from '@/services/googledrive.service';
import { logger } from '@/utils/logger';
import { GoogleAccountService } from '@/services/google-account.service';

const gAccountService = new GoogleAccountService();
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

            await gAccountService.create({
                email: userInfo.email!,
                googleId: userInfo.id!,
                tokens: tokens,
            });

            return res.redirect('/google-drive/files');
        } catch (error) {
            logger.error(error);
            res.status(500).json({ error: 'Google authentication failed' });
        }
    }

    static async listDriveFiles(req: Request, res: Response) {
        try {
            // @ts-ignore
            const user = (req.session as any)?.user;
            if (!user) return res.status(401).json({ error: 'Not authenticated' });

            const driveService = new GoogleDriveService(user.tokens);
            const files = await driveService.listFiles();

            return res.json(files);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: 'Failed to list files' });
        }
    }

    // static async uploadFile(req: Request, res: Response) {
    //     try {
    //         // @ts-ignore
    //         const user = (req.session as any)?.user;
    //         if (!user) return res.status(401).json({ error: 'Not authenticated' });

    //         const driveService = new GoogleDriveService(user.tokens);
    //         const file = await driveService.uploadFile(req.file!);

    //         return res.json(file);
    //     } catch (error) {
    //         logger.error(error);
    //         return res.status(500).json({ error: 'Failed to upload file' });
    //     }
    // }
}
