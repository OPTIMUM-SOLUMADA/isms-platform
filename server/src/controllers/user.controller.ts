import { Request, Response } from 'express';
import { UserService } from '@/services/user.service';
import { EmailService } from '@/services/email.service';
import { EmailTemplate } from '@/configs/email-template';
import { env } from '@/configs/env';
import { JwtService } from '@/services/jwt.service';

const service = new UserService();
const emailService = new EmailService();
const jwtService = new JwtService();

export class UserController {
    async create(req: Request, res: Response) {
        try {
            // check if user email exists
            const userExists = await service.findByEmail(req.body.email);
            if (userExists) {
                res.status(400).json({
                    error: 'User already exists',
                    code: 'ERR_USER_EXISTS',
                });
                return;
            }

            const { departmentId, sendInvitationLink, ...rest } = req.body;

            const user = await service.createUser({
                ...rest,
                department: {
                    connect: {
                        id: departmentId,
                    },
                },
            });

            res.status(201).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                error: (err as Error).message,
                code: 'ERR_SERVER_ERROR',
            });
        }
    }

    async sendInvitation(req: Request, res: Response) {
        try {
            const user = await service.getUseByIdNoInclude(req.params.id!);
            if (!user) {
                res.status(404).json({ error: 'User not found', code: 'ERR_USER_NOT_FOUND' });
            } else {
                // Check if user already has password hash set
                if (user.passwordHash) {
                    res.status(400).json({
                        error: 'User already has password set',
                        code: 'ERR_USER_PASSWORD_SET',
                    });
                    return;
                }

                const resetToken = await jwtService.generatePasswordChangeToken(user);

                // upate user passwordReset
                await service.updateUser(user.id, { passwordResetToken: resetToken });

                // SEND EMAIL INVITATION
                await emailService.sendMail({
                    to: user.email,
                    subject: 'Welcome to Solumada',
                    html: await EmailTemplate.welcome({
                        userName: user.name!,
                        orgName: env.ORG_NAME,
                        inviteLink: `${env.CORS_ORIGIN}/reset-password?token=${resetToken}&invitation=true`,
                        year: new Date().getFullYear().toString(),
                        headerDescription: '',
                    }),
                });

                res.json(user);
            }
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
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

    async activate(req: Request, res: Response) {
        try {
            const user = await service.activateUser(req.params.id!);
            res.json(user);
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
            console.log(err);
            res.status(400).json({
                error: (err as Error).message,
                code: 'ERR_SERVER_ERROR',
            });
        }
    }

    async list(req: Request, res: Response) {
        try {
            // Get queries params
            const { limit = '50', page = '1' } = req.query;
            const filter: any = {};
            if (req.query.role) filter.role = req.query.role;
            if (req.query.isActive) filter.isActive = req.query.isActive === 'true';

            const data = await service.listUsers({
                filter,
                page: Number(page),
                limit: Number(limit),
            });
            res.json(data);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async search(req: Request, res: Response) {
        try {
            const { q = '' } = req.query;
            const normalizedQ = q.toString().trim().toLowerCase();
            const users = await service.searchUsers(normalizedQ);
            res.json(users);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async getUserByIds(req: Request, res: Response) {
        try {
            const { ids = '' } = req.query;
            const idsSet = ids
                .toString()
                .split(',')
                .filter((e) => e);
            const users = await service.getUsersByIds(idsSet);
            res.json(users);
        } catch (err) {
            console.log(err);
            res.status(400).json({ error: (err as Error).message });
        }
    }
}
