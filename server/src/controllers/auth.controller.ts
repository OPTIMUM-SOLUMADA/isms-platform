import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { JwtService } from '@/services/jwt.service';
import { UserService } from '@/services/user.service';
import { EmailService } from '@/services/email.service';
import { EmailTemplate } from '@/configs/email-template';
import { env } from '@/configs/env';
import { hashPassword } from '@/utils/password';
import jwt from 'jsonwebtoken';
import { AuditEventType, AuditTargetType } from '@prisma/client';
import { toHashRouterUrl } from '@/utils/baseurl';

const authService = new AuthService();
const jwtService = new JwtService();
const userService = new UserService();
const emailService = new EmailService();

export class AuthController {
    login = async (req: Request, res: Response) => {
        const { email, password, rememberMe = false } = req.body;

        try {
            const user = await authService.login(email, password);
            if (!user) {
                // Audit log for login failure
                await req.log({
                    event: AuditEventType.AUTH_LOGIN_ATTEMPT,
                    details: {
                        email,
                        reason: 'INVALID_CREDENTIALS',
                    },
                    targets: [],
                    status: 'FAILURE',
                });
                res.status(400).json({
                    error: 'Invalid email or password',
                    code: 'ERR_INVALID_CREDENTIALS',
                });
                return;
            }

            if (!user.isActive) {
                // Audit log for login failure when user is inactive
                await req.log({
                    event: AuditEventType.AUTH_LOGIN_ATTEMPT,
                    details: {
                        email,
                        reason: 'USER_INACTIVE',
                    },
                    targets: [],
                    status: 'FAILURE',
                });
                res.status(400).json({
                    error: 'User is inactive. Please contact admin.',
                    code: 'ERR_USER_INACTIVE',
                });
                return;
            }

            // generate token
            const accessToken = jwtService.generateAccessToken(user);
            const refreshToken = jwtService.generateRefreshToken(user, rememberMe);

            req.user = user;
            // Audit log for login
            await req.log({
                event: AuditEventType.AUTH_LOGIN,
                details: {
                    email: user.email,
                    role: user.role,
                },
                targets: [
                    {
                        type: AuditTargetType.USER,
                        id: user.id,
                    },
                ],
            });

            // Configure cookie options based on environment
            const isProduction = env.NODE_ENV === 'production';
            const cookieOptions = {
                httpOnly: true,
                secure: isProduction, // HTTPS required in production
                sameSite: (isProduction ? 'none' : 'strict') as 'none' | 'strict',
                maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
                path: '/',
            };

            console.log('[AUTH_LOGIN] Setting cookie with options:', {
                ...cookieOptions,
                refreshTokenLength: refreshToken.length,
                environment: env.NODE_ENV,
            });

            // set cookie and header, then send json response
            res.cookie('refreshToken', refreshToken, cookieOptions)
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
        const refreshToken = req.cookies['refreshToken'];
        
        console.log('[AUTH_REFRESH] Request received:', {
            hasRefreshToken: !!refreshToken,
            refreshTokenLength: refreshToken?.length || 0,
            cookies: Object.keys(req.cookies || {}),
            origin: req.headers['origin'],
            userAgent: req.headers['user-agent'],
        });
        
        if (!refreshToken) {
            console.log('[AUTH_REFRESH] ERROR: No refresh token in cookies');
            res.status(401).json({
                error: 'Access Denied. No refresh token provided.',
                code: 'ERR_NO_REFRESH_TOKEN',
                availableCookies: Object.keys(req.cookies || {}),
            });
            return;
        }

        try {
            const decoded = jwtService.verifyRefreshToken(refreshToken);
            if (!decoded?.user?.email) {
                res.status(401).json({
                    error: 'Invalid token payload',
                    code: 'ERR_INVALID_TOKEN_PAYLOAD',
                });
                return;
            }

            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    code: 'ERR_USER_NOT_FOUND',
                });
                return;
            }

            if (!user.isActive) {
                res.status(403).json({
                    error: 'User is inactive',
                    code: 'ERR_USER_INACTIVE',
                });
                return;
            }

            const accessToken = jwtService.generateAccessToken(user);
            const { passwordHash, passwordResetToken, id, isActive, ...rest } = user;
            
            console.log('[AUTH_REFRESH] SUCCESS: New access token generated for', user.email);
            console.log('[AUTH_REFRESH] Token details:', {
                accessTokenLength: accessToken.length,
                userEmail: user.email,
                userId: user.id,
            });
            
            res.header('Authorization', `Bearer ${accessToken}`).status(200).json(rest);
        } catch (error: any) {
            console.error('[AUTH_REFRESH] ERROR:', {
                error: error.message,
                stack: error.stack,
                type: error.constructor.name,
            });
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({
                    error: 'Refresh token expired',
                    code: 'ERR_REFRESH_TOKEN_EXPIRED',
                });
            } else if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({
                    error: 'Invalid refresh token',
                    code: 'ERR_INVALID_REFRESH_TOKEN',
                });
            } else {
                res.status(500).json({
                    error: 'Server error',
                    code: 'ERR_SERVER_ERROR',
                });
            }
        }
    };

    // Verify JWT from Authorization header
    verify = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(400).json({ 
                    error: 'No token provided or malformed header',
                    code: 'ERR_NO_TOKEN'
                });
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
            console.error('Error verifying token:', err);
            if (err instanceof jwt.TokenExpiredError) {
                res.status(400).json({ 
                    error: 'Token has expired',
                    code: 'ERR_TOKEN_EXPIRED'
                });
            } else if (err instanceof jwt.JsonWebTokenError) {
                res.status(400).json({ 
                    error: 'Invalid token',
                    code: 'ERR_INVALID_TOKEN'
                });
            } else {
                res.status(500).json({ 
                    error: 'Server error verifying token',
                    code: 'ERR_SERVER_ERROR'
                });
            }
        }
    };

    logout = async (req: Request, res: Response) => {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
            });

            // Get user from JWT (req.user is set by authenticateToken middleware)
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized', code: 'ERR_UNAUTHORIZED' });
                return;
            }

            const user = await userService.getUserById(userId);
            if (!user) {
                res.status(404).json({ error: 'User not found', code: 'ERR_USER_NOT_FOUND' });
                return;
            }

            // Audit log logout
            await req.log({
                event: AuditEventType.AUTH_LOGOUT,
                details: {
                    email: user.email,
                    role: user.role,
                },
                targets: [
                    {
                        type: AuditTargetType.USER,
                        id: user.id,
                    },
                ],
            });
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (err) {
            console.error('Logout error:', err);
            res.status(500).json({
                error: 'Server error during logout',
                code: 'ERR_SERVER_ERROR',
            });
        }
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
                resetLink: toHashRouterUrl(`/reset-password`, { token: resetToken }),
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
        const { resetToken, password, isInvitation = false } = req.body;
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
                res.status(400).json({
                    error: 'Invalid or expired token',
                    code: 'ERR_INVALID_TOKEN',
                });
                return;
            }

            const passwordHash = await hashPassword(password);
            // update user password and activate if it's an invitation
            await userService.updateUser(user.id, {
                passwordResetToken: null,
                passwordHash,
                ...(isInvitation && { isActive: true }),
            });

            res.status(200).json({ message: 'Password reset successfully' });
        } catch (err) {
            console.error(err);
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

    verifyAccount = async (req: Request, res: Response) => {
        const { token } = req.body;
        try {
            const verified = await jwtService.verifyEmailInvitationToken(token);
            const userId = verified.user.id;
            const user = await userService.getUserById(userId);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                    code: 'ERR_USER_NOT_FOUND',
                });
                return;
            }

            if (user.isActive) {
                await userService.updateUser(user.id, {
                    passwordResetToken: null,
                });
                res.status(400).json({
                    message: 'User already verified',
                    code: 'ERR_USER_ALREADY_VERIFIED',
                });
                return;
            }

            // create reset password
            const passwordResetToken = await jwtService.generatePasswordChangeToken(user);
            await userService.updateUser(user.id, {
                isActive: true,
                passwordResetToken,
            });

            res.status(200).json({
                token: passwordResetToken,
            });
        } catch (err) {
            console.error('Error account verification token:', err);
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
