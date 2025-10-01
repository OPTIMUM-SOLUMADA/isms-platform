import express from 'express';
import { OwnerController } from '@/controllers/owner.controller';

const router = express.Router();
const controller = new OwnerController();

router.get('/', controller.list);

export default router;
