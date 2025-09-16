import { Request, Response } from 'express';
import { InvitationService } from '@/services/invitation.service';

export class InvitationController {
    static async create(req: Request, res: Response) {
        const { email, message, userId } = req.body;
        const invitedById = userId; // assume user is authenticated

        if (!invitedById) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        try {
            const invite = await InvitationService.createInvitation({
                email,
                invitedById,
                message,
            });
            res.status(201).json(invite);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    static async reset(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const invite = await InvitationService.resetInvitation(id!);
            res.json(invite);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    static async expire(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const invite = await InvitationService.expireInvitation(id!);
            res.json(invite);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    static async accept(req: Request, res: Response) {
        const { token, userId } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        try {
            const invite = await InvitationService.acceptInvitation(token, userId);
            res.json(invite);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const invites = await InvitationService.getAllInvitations();
            res.json(invites);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
}
