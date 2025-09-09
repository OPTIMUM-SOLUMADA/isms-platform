import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { JwtService } from '@/services/jwt.service';
import { UserService } from '@/services/user.service';
import { EmailService } from '@/services/email.service';
import { EmailTemplate } from '@/configs/email-template';
import { env } from '@/configs/env';
import { hashPassword } from '@/utils/password';
import jwt from 'jsonwebtoken';

const authService = new AuthService();
const jwtService = new JwtService();
const userService = new UserService();
const emailService = new EmailService();

export class AuthController {
    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await authService.login(email, password);
            if (!user) {
                res.status(400).json({
                    error: 'Invalid email or password',
                    code: 'ERR_INVALID_CREDENTIALS',
                });
                return;
            }

            if (!user.isActive) {
                res.status(400).json({
                    error: 'User is inactive. Please contact admin.',
                    code: 'ERR_USER_INACTIVE',
                });
                return;
            }

            // generate token
            const accessToken = jwtService.generateAccessToken(user);
            const refreshToken = jwtService.generateRefreshToken(user);

            // set cookie and header, then send json response
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                .header('Authorization', `Bearer ${accessToken}`)
                .json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: (err as Error).message,
                code: 'ERR_SERVER_ERROR',
            });
        }
    };

    refresh = async (req: Request, res: Response) => {
        console.log('[AuthController] Refreshing token...');
        const refreshToken = req.cookies['refreshToken'];
        console.log(refreshToken);
        if (!refreshToken) {
            res.status(403).send('Access Denied. No refresh token provided.');
            return;
        }

        try {
            const decoded = jwtService.verifyRefreshToken(refreshToken);
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    code: 'ERR_USER_NOT_FOUND',
                });
            } else {
                const accessToken = jwtService.generateAccessToken(user);
                const { passwordHash, ...rest } = user;
                // Exclude password
                res.header('Authorization', `Bearer ${accessToken}`).status(200).send(rest);
            }
        } catch (error: any) {
            console.error(error);
            res.status(400).send({
                error: 'Invalid refresh token.',
                code: 'ERR_INVALID_REFRESH_TOKEN',
            });
        }
    };

    // Verify JWT from Authorization header
    verify = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(400).json({ error: 'No token provided or malformed header' });
                return;
            }

            const accessToken = authHeader.split(' ')[1];
            const decoded = jwtService.verifyToken(accessToken!);
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    code: 'ERR_USER_NOT_FOUND',
                });
                return;
            }
            res.json(user);
        } catch (err) {
            console.error(err);
            if (err instanceof jwt.TokenExpiredError) {
                res.status(401).json({ error: 'Reset token has expired' });
            } else if (err instanceof jwt.JsonWebTokenError) {
                res.status(400).json({ error: 'Invalid reset token' });
            } else {
                res.status(500).json({ error: 'Server error verifying token' });
            }
        }
    };

    logout = async (req: Request, res: Response) => {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    };

    // Request password reset link
    requestPasswordReset = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const user = await userService.findByEmail(email);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    code: 'ERR_USER_NOT_FOUND',
                });
                return;
            }

            const resetToken = await jwtService.generatePasswordResetToken(user);

            // update user password reset token
            await userService.updateUser(user.id, {
                passwordResetToken: resetToken,
            });

            const template = await EmailTemplate.resetPassword({
                orgName: env.ORG_NAME,
                year: new Date().getFullYear().toString(),
                user: { name: user.name },
                resetLink: `${env.CORS_ORIGIN}/reset-password?token=${resetToken}`,
                headerDescription: '',
            });

            await emailService.sendMail({
                to: user.email!,
                subject: 'Reset Password',
                html: template,
            });

            res.status(200).json({ message: 'Password reset email sent' });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: (err as Error).message,
                code: 'ERR_SERVER_ERROR',
            });
        }
    };

    // update password
    changePassword = async (req: Request, res: Response) => {
        const { resetToken, password } = req.body;
        try {
            console.log(resetToken);
            const decoded = await jwtService.verifyPasswordResetToken(resetToken);

            // find user
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    code: 'ERR_USER_NOT_FOUND',
                });
                return;
            }

            if (user.passwordResetToken !== resetToken) {
                res.status(400).json({
                    error: 'Invalid or expired token',
                    code: 'ERR_INVALID_TOKEN',
                });
                return;
            }

            const passwordHash = await hashPassword(password);
            // update user password
            await userService.updateUser(user.id, {
                passwordResetToken: null,
                passwordHash,
            });

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (err) {
            console.error(err);
            if (err instanceof jwt.TokenExpiredError) {
                res.status(401).json({
                    error: 'Reset token has expired',
                    code: 'ERR_RESET_TOKEN_EXPIRED',
                });
            } else if (err instanceof jwt.JsonWebTokenError) {
                res.status(401).json({
                    error: 'Invalid reset token',
                    code: 'ERR_INVALID_RESET_TOKEN',
                });
            } else {
                res.status(500).json({
                    error: (err as Error).message,
                    code: 'ERR_SERVER_ERROR',
                });
            }
        }
    };

    // Verify password reset token
    verifyPasswordResetToken = async (req: Request, res: Response) => {
        const { resetToken } = req.body;
        try {
            const decoded = await jwtService.verifyPasswordResetToken(resetToken);

            // find user
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    code: 'ERR_USER_NOT_FOUND',
                });
                return;
            }

            if (user.passwordResetToken !== resetToken) {
                // remove passwordResetToken from user
                if (user.passwordResetToken !== null) {
                    await userService.updateUser(user.id, {
                        passwordResetToken: null,
                    });
                }

                res.status(400).json({
                    error: 'Link has expired',
                    code: 'ERR_RESET_TOKEN_EXPIRED',
                });
                return;
            }

            res.status(200).json(decoded.user);
        } catch (err) {
            console.error('Error verifying password reset token:', err);
            if (err instanceof jwt.TokenExpiredError) {
                res.status(400).json({
                    error: 'Reset token has expired',
                    code: 'ERR_RESET_TOKEN_EXPIRED',
                });
            } else if (err instanceof jwt.JsonWebTokenError) {
                res.status(400).json({
                    error: 'Invalid reset token',
                    code: 'ERR_INVALID_RESET_TOKEN',
                });
            } else {
                res.status(500).json({
                    error: 'Server error verifying token',
                    code: 'ERR_SERVER_ERROR',
                });
            }
        }
    };
}
