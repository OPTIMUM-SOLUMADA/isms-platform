import { Request, Response } from 'express';
import { DepartmentService } from '@/services/department.service';
import { Prisma } from '@prisma/client';

const service = new DepartmentService();

export class DepartmentController {
    async create(req: Request, res: Response) {
        try {
            const { name, description, userId } = req.body;
            const department = await service.createDepartment({
                name,
                description,
                ...(userId && { createdBy: { connect: { id: userId } } }),
            });
            return res.status(201).json(department);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json({
                        error: err.message,
                        code: 'ERR_DEPARTMENT_DUPLICATED_NAME',
                    });
                }
            }
            return res.status(500).json({ error: (err as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const department = await service.getDepartmentById(req.params.id!);
            if (!department) {
                res.status(404).json({ error: 'Department not found' });
            } else {
                res.json(department);
            }
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { name, description } = req.body;

            const updated = await service.updateDepartment(req.params.id!, {
                name,
                description,
            });

            return res.json(updated);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json({
                        error: err.message,
                        code: 'ERR_DEPARTMENT_DUPLICATED_NAME',
                    });
                }
            }
            return res.status(400).json({ error: (err as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await service.deleteDepartment(req.params.id!);
            res.status(204).send();
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { limit = '50', page = '1' } = req.query;
            const departments = await service.listDepartments({
                page: Number(page),
                limit: Number(limit),
            });
            res.json(departments);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    }

    initialize = async (req: Request, res: Response) => {
        try {
            const departments = await service.init();
            res.json(departments);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
}
