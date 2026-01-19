import { GoogleAccountService } from '@/services/google-account.service';
import { Request, Response, NextFunction } from 'express';
import { Session } from 'express-session';

const googleAccountService = new GoogleAccountService();

export const googleAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const account = await googleAccountService.getLast();
        if (!account) {
            return res.sendStatus(403);
        }

        if (req.session) {
            // Cast de la session pour TypeScript
            const session = req.session as Session & {
                googleAccount?: {
                    googleId: string;
                    email: string;
                    tokens: {
                        access_token: string;
                        refresh_token?: string;
                        scope?: string;
                        token_type?: string;
                        id_token?: string;
                        refresh_token_expires_in?: number;
                        expiry_date?: number;
                    } | null;
                    workingDirId?: string;
                };
            };

            session.googleAccount = {
                email: account.email,
                googleId: account.googleId,
                tokens: account.tokens as any, // tu peux typer correctement ici si tu veux
                workingDirId: account.workingDirId,
            };
        }

        return next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(403);
    }
};
