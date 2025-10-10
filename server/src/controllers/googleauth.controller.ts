import svc from '@/configs/google-service';
import { Request, Response } from 'express';
export class GoogleDriveAuthController {
    async fallback(req: Request, res: Response) {
        const code = req.query.code as string;
        if (!code) {
            res.send('No code received');
            return;
        }

        try {
            const tokens = await svc.getTokenFromCode(code);
            // save tokens to DB or file
            console.log('Tokens:', tokens);
            res.send('Authorization successful! You can close this tab.');
        } catch (err) {
            console.error(err);
            res.send('Error exchanging code for token');
        }
    }
}
