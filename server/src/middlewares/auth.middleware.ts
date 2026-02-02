import { JwtService } from '@/services/jwt.service';
import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const jwtService = new JwtService();

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'No token provided',
            code: 'ERR_NO_TOKEN',
        });
    }

    try {
        const payload = jwtService.verifyToken(token);
        
        // Validate payload
        if (!payload?.user?.id || !payload.user.email) {
            return res.status(401).json({
                error: 'Invalid token payload',
                code: 'ERR_INVALID_TOKEN_PAYLOAD',
            });
        }
        
        req.user = payload.user;
        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expired',
                code: 'ERR_TOKEN_EXPIRED',
            });
        } else if (error instanceof JsonWebTokenError) {
            return res.status(403).json({
                error: 'Invalid token',
                code: 'ERR_INVALID_TOKEN',
            });
        } else {
            console.error('Auth middleware error:', error);
            return res.status(500).json({
                error: 'Authentication error',
                code: 'ERR_AUTH_ERROR',
            });
        }
    }
}
