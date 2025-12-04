import { Request, Response } from 'express';
import { DepartmentService } from '@/services/department.service';
import { Prisma, AuditEventType } from '@prisma/client';
import { DepartmentRoleService } from '@/services/departmentRole.service';
import { getChanges } from '@/utils/change';

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
            // Audit
            await req.log({
                event: AuditEventType.DEPARTMENT_CREATE,
                targets: [{ id: department.id, type: 'DEPARTMENT' }],
                details: { name: department.name, description: department.description },
                status: 'SUCCESS',
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
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { name, description } = req.body;

            const before = await service.getDepartmentById(req.params.id!);

            const updated = await service.updateDepartment(req.params.id!, {
                name,
                description,
            });

            // Audit: record changes
            await req.log({
                event: AuditEventType.DEPARTMENT_UPDATE,
                targets: [{ id: updated.id, type: 'DEPARTMENT' }],
                details: { ...(getChanges(before, updated) || {}) },
                status: 'SUCCESS',
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
            return res.status(500).json({ error: (err as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const dept = await service.getDepartmentById(req.params.id!);
            await service.deleteDepartment(req.params.id!);

            // Audit
            if (dept) {
                await req.log({
                    event: AuditEventType.DEPARTMENT_DELETE,
                    targets: [{ id: dept.id, type: 'DEPARTMENT' }],
                    details: { name: dept.name, description: dept.description },
                    status: 'SUCCESS',
                });
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const { limit = 'Infinity', page = '1' } = req.query;
            const departments = await service.listDepartments({
                page: Number(page),
                limit: Number(limit),
            });
            res.json(departments);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: (err as Error).message });
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
            res.status(500).json({ error: (err as Error).message });
        }
    };

    async getRoles(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'Id is required' });
            const { limit = '50', page = '1' } = req.query;
            const data = await serviceRole.list({
                filter: { departmentId: id },
                page: Number(page),
                limit: Number(limit),
            });
            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: (err as Error).message });
        }
    }

    async getRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ error: 'Id is required' });
            const data = await serviceRole.getRole(id);
            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: (err as Error).message });
        }
    }

    addRoles = async (req: Request, res: Response) => {
        try {
            const { name, description, userId } = req.body;
            const department = await serviceRole.addRoles({
                name,
                description,
                createdBy: { connect: { id: userId } },
                department: { connect: { id: req.params.id! } },
            });
            // Audit: adding a role to a department
            await req.log({
                event: AuditEventType.DEPARTMENT_UPDATE,
                targets: [{ id: req.params.id!, type: 'DEPARTMENT' }],
                details: { action: 'ADD_ROLE', role: { id: department.id, name: department.name, description: department.description } },
                status: 'SUCCESS',
            });
            return res.json(department);
        } catch (err) {
            console.log((err as any).message);
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(400).json({
                        error: err.message,
                        code: 'ERR_DEPARTMENT_ROLE_DUPLICATED_NAME',
                    });
                }
            }
            return res.status(500).json({ error: (err as Error).message });
        }
    };

    updateRoles = async (req: Request, res: Response) => {
        try {
            const { roles } = req.body;
            // Capture snapshot before update (roles for this department)
            const before = await serviceRole.list({ filter: { departmentId: req.params.id! }, page: 1, limit: 1000 });

            const department = await serviceRole.updateRoles(req.params.id!, roles);

            // Audit: updating roles for department
            await req.log({
                event: AuditEventType.DEPARTMENT_UPDATE,
                targets: [{ id: req.params.id!, type: 'DEPARTMENT' }],
                details: { action: 'UPDATE_ROLES', before: before.departmentRoles, after: department },
                status: 'SUCCESS',
            });

            res.json(department);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    };

    removeRoles = async (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                throw new Error('Missing parameter: id');
            }
            const department = await serviceRole.removeRoles(req.params.id);

            // Audit: remove role
            if (department) {
                await req.log({
                    event: AuditEventType.DEPARTMENT_UPDATE,
                    targets: [{ id: department.departmentId, type: 'DEPARTMENT' }],
                    details: { action: 'REMOVE_ROLE', role: { id: department.id, name: department.name } },
                    status: 'SUCCESS',
                });
            }

            res.json(department);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    };
}
