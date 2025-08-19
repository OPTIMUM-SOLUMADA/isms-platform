import express from 'express';
import { UserController } from '@/controllers/user.controller';
import { validate } from '@/middlewares/validate';
import { userCreateSchema } from '@/validators/user.validator';

const router = express.Router();
const controller = new UserController();

router.post('/', validate(userCreateSchema), controller.create.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.patch('/:id/deactivate', controller.deactivate.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
router.get('/', controller.list.bind(controller));

export default router;
