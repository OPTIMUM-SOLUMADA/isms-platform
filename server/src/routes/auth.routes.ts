import express from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate';
import { changePasswordSchema, loginSchema, requestPasswordResetSchema, verifyResetTokenSchema } from '@/validators/auth.validator';

const router = express.Router();
const authController = new AuthController();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/verify', authController.verify);
router.post('/reset-password', validate(requestPasswordResetSchema), authController.requestPasswordReset);
router.patch('/change-password', validate(changePasswordSchema), authController.changePassword);
router.post('/verify-reset-token', validate(verifyResetTokenSchema), authController.verifyPasswordResetToken);

export default router;
