import { GoogleAccountService } from '@/services/google-account.service';
import { Request, Response, NextFunction } from 'express';

const googleAccountService = new GoogleAccountService();

export const googleAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const account = await googleAccountService.getLast();
        if (!account) {
            return res.sendStatus(403);
        }

        // Create OAuth client
        if (req.session) {
            const expiryDate = account.token_expiry ? account.token_expiry.getTime() : undefined;
            req.session.gooleAccount = {
                email: account.email,
                googleId: account.google_id || '',
                tokens: {
                    access_token: account.access_token || '',
                    refresh_token: account.refresh_token || '',
                    ...(expiryDate !== undefined && { expiry_date: expiryDate }),
                },
                workingDirId: account.working_dir_id || '',
            };
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
};
