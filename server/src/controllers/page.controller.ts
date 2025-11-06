import { GoogleAccountService } from '@/services/google-account.service';
import { Request, Response } from 'express';

const googleAccountService = new GoogleAccountService();

export class PageController {
    async index(req: Request, res: Response) {
        const account = await googleAccountService.getLast();
        if (!account) {
            return res.render('auth/google-login');
        }

        return res.render('connected', { account });
    }

    async logout(req: Request, res: Response) {
        try {
            await googleAccountService.deleteAll();
            return res.redirect('/');
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Logout failed' });
        }
    }
}
