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
                res.status(400).json({ error: 'Invalid email or password' });
                return;
            }

            if (!user.isActive) {
                res.status(400).json({ error: 'User is inactive. Please contact admin.' });
                return;
            }

            // generate token
            const accessToken = jwtService.generateAccessToken(user);
            const refreshToken = jwtService.generateRefreshToken(user);

            // set cookie and header, then send json response
            res
                .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                .header('Authorization', `Bearer ${accessToken}`)
                .json({
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }


    refresh = async (req: Request, res: Response) => {
        console.log('[AuthController] Refreshing token...');
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            res.status(401).send('Access Denied. No refresh token provided.');
            return;
        }

        try {
            const decoded = jwtService.verifyRefreshToken(refreshToken) as any;
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({ user: 'User not found' });
            } else {
                const accessToken = jwtService.generateAccessToken(user);
                const { passwordHash, ...rest } = user;
                // Exclude password
                res.header('Authorization', `Bearer ${accessToken}`)
                    .status(200)
                    .send(rest);
            }
        } catch (error: any) {
            console.error(error);
            res.status(400).send('Invalid refresh token.');
        }
    }

    // Verify JWT from Authorization header
    verify = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ error: "No token provided or malformed header" });
                return;
            }

            const accessToken = authHeader.split(' ')[1];
            const decoded = jwtService.verifyToken(accessToken!);
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(user);

        } catch (err) {
            console.error(err);
            if (err instanceof jwt.TokenExpiredError) {
                res.status(401).json({ error: "Reset token has expired" });
            } else if (err instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ error: "Invalid reset token" });
            } else {
                res.status(500).json({ error: "Server error verifying token" });
            }
        }
    }

    logout = async (req: Request, res: Response) => {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200)
            .json({ message: 'Logged out successfully' });
    }

    // Request password reset link
    requestPasswordReset = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const user = await userService.findByEmail(email);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const resetToken = await jwtService.generatePasswordResetToken(user);

            // update user password reset token
            await userService.updateUser(user.id, {
                passwordResetToken: resetToken
            });

            await emailService.sendMail({
                to: user.email!,
                subject: "Reset Password",
                html: EmailTemplate.resetPassword({
                    username: user.name!,
                    resetLink: `${env.CORS_ORIGIN}/reset-password?token=${resetToken}`
                })
            });

            res.status(200).json({ message: 'Password reset email sent' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: (err as Error).message });
        }
    }

    // update password
    changePassword = async (req: Request, res: Response) => {
        const { resetToken, password } = req.body;
        try {
            console.log(resetToken)
            const decoded = await jwtService.verifyPasswordResetToken(resetToken);

            console.log(decoded)
            // find user
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            if (user.passwordResetToken !== resetToken) {
                res.status(400).json({ error: 'Invalid or expired token' });
                return;
            }

            const passwordHash = await hashPassword(password);
            // update user password
            await userService.updateUser(user.id, {
                passwordResetToken: null,
                passwordHash
            });

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (err) {
            console.error(err);
            if (err instanceof jwt.TokenExpiredError) {
                res.status(401).json({ error: "Reset token has expired" });
            } else if (err instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ error: "Invalid reset token" });
            } else {
                res.status(500).json({ error: (err as Error).message });
            }
        }
    }

    // Verify password reset token
    verifyPasswordResetToken = async (req: Request, res: Response) => {
        const { resetToken } = req.body;
        try {
            const decoded = await jwtService.verifyPasswordResetToken(resetToken);

            // find user
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            if (user.passwordResetToken !== resetToken) {
                res.status(400).json({ error: 'Link has expired' });
                return;
            }

            res.status(200).json(decoded.user);
        } catch (err) {
            console.error("Error verifying password reset token:", err);
            if (err instanceof jwt.TokenExpiredError) {
                res.status(401).json({ error: "Reset token has expired" });
            } else if (err instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ error: "Invalid reset token" });
            } else {
                res.status(500).json({ error: "Server error verifying token" });
            }
        }
    }
}
