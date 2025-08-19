import express from 'express';
import { DepartmentController } from '@/controllers/department.controller';
import { validate } from '@/middlewares/validate';
import { departmentCreateSchema } from '@/validators/department.validator';

const router = express.Router();
const controller = new DepartmentController();

router.post('/', validate(departmentCreateSchema), controller.create.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
router.get('/', controller.list.bind(controller));
router.post('/initialize', controller.initialize);

export default router;
