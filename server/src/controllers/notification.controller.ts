import { Request, Response } from 'express';
import NotificationService from '@/services/notification.service';
import { Prisma } from '@prisma/client';

const service = NotificationService;

export class NotificationController {
    async list(req: Request, res: Response) {
        try {
            const { limit = '20', page = '1' } = req.query;
            const userId = req.user?.id;

            const filter: any = {};
            if (userId) filter.userId = userId;

            const data = await service.list({ filter, page: Number(page), limit: Number(limit) });
            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: (err as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = req.params.id!;
            const notification = await service.findById(id);
            if (!notification) return res.status(404).json({ error: 'Notification not found' });
            return res.json(notification);
        } catch (err) {
            return res.status(500).json({ error: (err as Error).message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { userId, type, title, message, documentId } = req.body;
            const created = await service.create({
                user: { connect: { id: userId } },
                type,
                title,
                message,
                ...(documentId ? { document: { connect: { id: documentId } } } : {}),
            } as Prisma.NotificationCreateInput);
            res.status(201).json(created);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async markRead(req: Request, res: Response) {
        try {
            const id = req.params.id!;
            const updated = await service.markRead(id);
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async markAllRead(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const result = await service.markAllRead(userId);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id!;
            const deleted = await service.delete(id);
            res.json(deleted);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async deleteAll(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const result = await service.deleteAll(userId);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}

export default new NotificationController();
