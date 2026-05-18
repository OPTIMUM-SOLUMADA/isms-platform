import express from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate.middleware';
import { authenticateToken } from '@/middlewares/auth.middleware';
import {
    changePasswordSchema,
    loginSchema,
    requestPasswordResetSchema,
    verifyResetTokenSchema,
} from '@/validators/auth.validator';

const router = express.Router();
const authController = new AuthController();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again later.', code: 'ERR_TOO_MANY_REQUESTS' },
});

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/verify', authController.verify);
router.post(
    '/reset-password',
    validate(requestPasswordResetSchema),
    authController.requestPasswordReset,
);
router.patch('/change-password', validate(changePasswordSchema), authController.changePassword);
router.post(
    '/verify-reset-token',
    validate(verifyResetTokenSchema),
    authController.verifyPasswordResetToken,
);
// Verify account
router.post('/verify-account', authController.verifyAccount);

export default router;
