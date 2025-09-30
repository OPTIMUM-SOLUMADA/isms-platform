import express from 'express';
import { DepartmentController } from '@/controllers/department.controller';
import { validate } from '@/middlewares/validate';
import { departmentCreateSchema } from '@/validators/department.validator';

const router = express.Router();
const controller = new DepartmentController();

// Departments CRUD
// Search departments
router.get('/search', controller.search.bind(controller));

router.post('/', validate(departmentCreateSchema), controller.create.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
router.post('/initialize', controller.initialize);

// Department Roles CRUD
router.get('/:id/roles', controller.getRoles.bind(controller));
router.post('/:id/roles', controller.addRoles.bind(controller));
router.put('/:id/roles', controller.updateRoles.bind(controller));
router.delete('/:id/roles', controller.removeRoles.bind(controller));

export default router;
