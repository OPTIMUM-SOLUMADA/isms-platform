import { Request, Response } from 'express';
import { DepartmentService } from '@/services/department.service';

const service = new DepartmentService();

export class DepartmentController {
    async create(req: Request, res: Response) {
        try {
            const department = await service.createDepartment(req.body);
            res.status(201).json(department);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
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
            const updated = await service.updateDepartment(req.params.id!, req.body);
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
