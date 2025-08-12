import express from 'express';
import { UserController } from '@/controllers/user.controller';

const router = express.Router();
const controller = new UserController();

router.post('/', controller.create.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.patch('/:id/deactivate', controller.deactivate.bind(controller));
router.get('/', controller.list.bind(controller));

export default router;
