import { Router } from 'express';
import { InvitationController } from '@/controllers/invitation.controller';

const router = Router();

router.get('/', InvitationController.list);
router.post('/', InvitationController.create);
router.post('/accept', InvitationController.accept);
router.post('/:id/reset', InvitationController.reset);
router.post('/:id/expire', InvitationController.expire);

export default router;
