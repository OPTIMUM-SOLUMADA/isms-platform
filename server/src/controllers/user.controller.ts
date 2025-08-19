import { Request, Response } from 'express';
import { UserService } from '@/services/user.service';

const service = new UserService();

export class UserController {
    async create(req: Request, res: Response) {
        try {
            // check if user email exists
            const userExists = await service.findByEmail(req.body.email);
            if (userExists) {
                res.status(400).json({
                    error: 'User already exists',
                    code: 'ERR_USER_EXISTS'
                });
                return;
            }
            const user = await service.createUser(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({
                error: (err as Error).message,
                code: "ERR_SERVER_ERROR"
            });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const user = await service.getUserById(req.params.id!);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.json(user);
            }
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const updated = await service.updateUser(req.params.id!, req.body);
            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async deactivate(req: Request, res: Response) {
        try {
            const user = await service.deactivateUser(req.params.id!);
            res.json(user);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const user = await service.delete(req.params.id!);
            res.json(user);
        } catch (err) {
            res.status(400).json({
                error: (err as Error).message,
                code: "ERR_SERVER_ERROR"
            });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const filter: any = {};
            if (req.query.role) filter.role = req.query.role;
            if (req.query.isActive) filter.isActive = req.query.isActive === 'true';

            const users = await service.listUsers(filter);
            res.json(users);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }
}
