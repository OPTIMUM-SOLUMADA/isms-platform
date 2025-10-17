import express from 'express';
import { DepartmentRoleController } from '@/controllers/departmentrole.controller';

const router = express.Router();
const controller = new DepartmentRoleController();

router.get('/:id', controller.findById.bind(controller));
router.get('/', controller.findAll.bind(controller));

export default router;
