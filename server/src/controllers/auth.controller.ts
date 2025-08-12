import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { JwtService } from '@/services/jwt.service';
import { UserService } from '@/services/user.service';

const authService = new AuthService();
const jwtService = new JwtService();
const userService = new UserService();

export class AuthController {
    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await authService.login(email, password);
            if (!user) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            if (!user.isActive) {
                res.status(401).json({ error: 'User is inactive. Please contact admin.' });
                return;
            }

            // generate token
            const accessToken = jwtService.generateAccessToken(user);
            const refreshToken = jwtService.generateRefreshToken(user);

            // set cookie and header, then send json response
            res
                .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                .header('Authorization', accessToken)
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
            const decoded = jwtService.verifyToken(refreshToken) as any;
            const user = await userService.findByEmail(decoded.user.email);
            if (!user) {
                res.status(404).json({ user: 'User not found' });
            } else {
                const accessToken = jwtService.generateAccessToken(user);
                // Exclude password
                res.header('Authorization', accessToken)
                    .send(user);
            }
        } catch (error: any) {
            console.error(error);
            res.status(400).send('Invalid refresh token.');
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
}
