import express from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate';
import { loginSchema } from '@/validators/auth.validator';

const router = express.Router();
const authController = new AuthController();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

export default router;
