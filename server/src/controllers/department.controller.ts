import { Request, Response } from 'express';
import { DepartmentService } from '@/services/department.service';
import { Prisma } from '@prisma/client';

const service = new DepartmentService();

export class DepartmentController {
    async create(req: Request, res: Response) {
        try {
            const department = await service.createDepartment(req.body);
            res.status(201).json(department);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    res.status(400).json({
                        error: err.message,
                        code: 'ERR_DEPARTMENT_DUPLICATED_NAME',
                    });
                } else {
                    res.status(400).json({
                        error: err.message,
                    });
                }
            } else {
                res.status(500).json({ error: (err as Error).message });
            }
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
            console.log('req', req.body);

            const updated = await service.updateDepartment(req.params.id!, req.body);
            console.log('updat', updated);

            res.json(updated);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
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
            const departments = await service.listDepartments();
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
