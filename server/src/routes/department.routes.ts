import express from 'express';
import { DepartmentController } from '@/controllers/department.controller';

const router = express.Router();
const controller = new DepartmentController();

router.post('/', controller.create.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
router.get('/', controller.list.bind(controller));

export default router;
