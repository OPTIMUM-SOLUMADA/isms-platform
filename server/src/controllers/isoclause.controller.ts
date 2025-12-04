import { Request, Response } from 'express';
import { ISOClauseService } from '@/services/isoclause.service';
import { Prisma, AuditEventType } from '@prisma/client';
import { getChanges } from '@/utils/change';

const service = new ISOClauseService();

export class ISOClauseController {
    async create(req: Request, res: Response) {
        try {
            const { name, description, code, userId } = req.body;
            const clause = await service.create({
                name,
                description,
                code,
                ...(userId && { createdBy: { connect: { id: userId } } }),
            });
            // Audit: ISO clause created
            await req.log({
                event: AuditEventType.DOCUMENT_CREATE,
                targets: [{ id: clause.id, type: 'DOCUMENT' }],
                details: { resource: 'ISO_CLAUSE', code: clause.code, name: clause.name, description: clause.description },
                status: 'SUCCESS',
            });
            return res.status(201).json(clause);
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(400).json({
                        error: error.message,
                        code: 'ERR_ISOCODE_DUPLICATED_NAME',
                    });
                }
            }
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const { page = '1', limit = '20' } = req.query;
            const clauses = await service.list({
                page: Number(page),
                limit: Number(limit),
            });
            return res.json(clauses);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const clause = await service.findById(req.params.id!);
            if (!clause) return res.status(404).json({ error: 'Clause not found' });
            return res.json(clause);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { name, description, code } = req.body;
            const before = await service.findById(req.params.id!);
            const clause = await service.update(req.params.id!, {
                name,
                description,
                code,
            });
            // Audit: ISO clause updated
            await req.log({
                event: AuditEventType.DOCUMENT_UPDATE,
                targets: [{ id: clause.id, type: 'DOCUMENT' }],
                details: { resource: 'ISO_CLAUSE', ...(getChanges(before, clause) || {}) },
                status: 'SUCCESS',
            });
            return res.json(clause);
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res.status(400).json({
                        error: error.message,
                        code: 'ERR_ISOCODE_DUPLICATED_NAME',
                    });
                }
            }
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const clause = await service.findById(req.params.id!);
            await service.delete(req.params.id!);
            // Audit: ISO clause deleted
            if (clause) {
                await req.log({
                    event: AuditEventType.DOCUMENT_DELETE,
                    targets: [{ id: clause.id, type: 'DOCUMENT' }],
                    details: { resource: 'ISO_CLAUSE', code: clause.code, name: clause.name },
                    status: 'SUCCESS',
                });
            }
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async search(req: Request, res: Response) {
        try {
            const { q = '' } = req.query;
            const normalizedQ = q.toString().trim().toLowerCase();
            const clauses = await service.search(normalizedQ);
            return res.json(clauses);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async initialize(req: Request, res: Response) {
        try {
            const clauses = await service.initialize();
            return res.json(clauses);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
