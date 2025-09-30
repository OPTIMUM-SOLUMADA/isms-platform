import { Request, Response } from 'express';
import { DepartmentService } from '@/services/department.service';
import { Prisma } from '@prisma/client';
import { DepartmentRoleService } from '@/services/departmentRole.service';

const service = new DepartmentService();
const serviceRole = new DepartmentRoleService();

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

    async search(req: Request, res: Response) {
        try {
            const { q = '' } = req.query;
            const normalizedQ = q.toString().trim().toLowerCase();
            const departments = await service.search(normalizedQ);
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

    async getRoles(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'Id is required' });
            const { limit = '50', page = '1' } = req.query;
            const departments = await serviceRole.listDepartmentsRole({
                id,
                page: Number(page),
                limit: Number(limit),
            });
            console.log('id', id);
            console.log('deapr', departments);
            return res.json(departments);
        } catch (err) {
            return res.status(400).json({ error: (err as Error).message });
        }
    }

    addRoles = async (req: Request, res: Response) => {
        try {
            const { roles } = req.body;
            const department = await serviceRole.addRoles(req.params.id!, roles);
            res.json(department);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };

    updateRoles = async (req: Request, res: Response) => {
        try {
            const { roles } = req.body;
            const department = await serviceRole.updateRoles(req.params.id!, roles);
            res.json(department);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };

    removeRoles = async (req: Request, res: Response) => {
        try {
            const department = await serviceRole.removeRoles(req.body.id);
            res.json(department);
        } catch (err) {
            res.status(400).json({ error: (err as Error).message });
        }
    };
}
