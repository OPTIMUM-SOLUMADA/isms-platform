import express from 'express';
import { PageController } from '@/controllers/page.controller';

const router = express.Router();
const controller = new PageController();

// get pages
router.get('/', controller.index.bind(controller));
router.get('/logout', controller.logout.bind(controller));

export default router;
