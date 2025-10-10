import { Router } from 'express';
import { GoogleDriveAuthController } from '@/controllers/googleauth.controller';

const router = Router();
const excelController = new GoogleDriveAuthController();

router.get('/oauth2callback', excelController.fallback);

export default router;
