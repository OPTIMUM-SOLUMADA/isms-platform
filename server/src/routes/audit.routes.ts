import { AuditController } from '@/controllers/audit.controller';
import express from 'express';
const router = express.Router();
const controller = new AuditController();

router.get('/', controller.getAll.bind(controller));
router.get('/stats', controller.getStats.bind(controller));

export default router;
