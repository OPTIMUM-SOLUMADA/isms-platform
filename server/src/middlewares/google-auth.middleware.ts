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
            req.session.gooleAccount = {
                email: account.email,
                googleId: account.googleId,
                tokens: account.tokens as any,
                workingDirId: account.workingDirId,
            };
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
};
