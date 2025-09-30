import express from 'express';
import { UserController } from '@/controllers/user.controller';
import { validate } from '@/middlewares/validate';
import { userCreateSchema } from '@/validators/user.validator';

const router = express.Router();
const controller = new UserController();

// search users
router.get('/search', controller.search.bind(controller));
// get user by ids
router.get('/by-ids', controller.getUserByIds.bind(controller));

router.post('/', validate(userCreateSchema), controller.create.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));
router.get('/', controller.list.bind(controller));

// invite user
router.post('/:id/invite', controller.sendEmailVerification.bind(controller));
// deactivate user
router.patch('/:id/deactivate', controller.deactivate.bind(controller));
// activate user
router.patch('/:id/activate', controller.activate.bind(controller));

export default router;
