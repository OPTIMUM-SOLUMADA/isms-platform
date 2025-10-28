import { Router } from 'express';
import { GoogleDriveController } from '@/controllers/googledrive.controller';
import { googleAuthMiddleware } from '@/middlewares/google-auth';

const router = Router();

router.get('/auth', GoogleDriveController.redirectToGoogle);
router.get('/oauth2callback', GoogleDriveController.handleGoogleCallback);
router.get('/files', googleAuthMiddleware, GoogleDriveController.listDriveFiles);
router.post(
    '/grant-permissions/:documentId',
    googleAuthMiddleware,
    GoogleDriveController.grantPermissions,
);

export default router;
