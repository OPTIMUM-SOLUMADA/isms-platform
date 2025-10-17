import { Request, Response } from 'express';
import { DepartmentRoleService } from '@/services/departmentRole.service';

const service = new DepartmentRoleService();

export class DepartmentRoleController {
    async findAll(_req: Request, res: Response) {
        try {
            const types = await service.findAll();
            return res.json(types);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const type = await service.findById(req.params.id!);
            if (!type) {
                res.status(404).json({
                    error: 'Review not found',
                    code: 'ERR_DOCUMENT_REVIEW_NOT_FOUND',
                });
                return;
            }
            return res.json(type);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
