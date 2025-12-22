import { GoogleAccountService } from '@/services/google-account.service';
import { Request, Response } from 'express';

const googleAccountService = new GoogleAccountService();

export class PageController {
    async index(req: Request, res: Response) {
        const account = await googleAccountService.getLast();
        if (!account || account?.is_logged_in === false) {
            return res.render('auth/google-login');
        }

        return res.render('connected', { account });
    }

    async logout(req: Request, res: Response) {
        try {
            const account = await googleAccountService.getLast();
            if (!account) {
                return res.status(404).json({ error: 'Account not found' });
            }
            await googleAccountService.update(account.id_google_account, {
                is_logged_in: false,
                access_token: null,
                refresh_token: null,
                token_expiry: null,
            });
            return res.redirect('/');
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Logout failed' });
        }
    }
}
