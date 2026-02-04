import { JwtService } from '@/services/jwt.service';
import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const jwtService = new JwtService();

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Enhanced logging for debugging
    console.log('[AUTH_MIDDLEWARE] Request:', {
        path: req.path,
        method: req.method,
        hasAuthHeader: !!authHeader,
        headerFormat: authHeader ? authHeader.substring(0, 20) + '...' : null,
        tokenPresent: !!token,
        tokenLength: token?.length || 0,
        origin: req.headers['origin'],
        cookies: Object.keys(req.cookies || {}),
    });

    if (!token) {
        console.log('[AUTH_MIDDLEWARE] ERROR: No token provided for', req.path);
        return res.status(401).json({
            error: 'No token provided',
            code: 'ERR_NO_TOKEN',
            path: req.path,
        });
    }

    try {
        const payload = jwtService.verifyToken(token);
        
        // Validate payload
        if (!payload?.user?.id || !payload.user.email) {
            console.log('[AUTH_MIDDLEWARE] ERROR: Invalid token payload');
            return res.status(401).json({
                error: 'Invalid token payload',
                code: 'ERR_INVALID_TOKEN_PAYLOAD',
                path: req.path,
            });
        }
        
        console.log('[AUTH_MIDDLEWARE] SUCCESS: Token verified for user', payload.user.email);
        req.user = payload.user;
        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log('[AUTH_MIDDLEWARE] ERROR: Token expired for', req.path);
            return res.status(401).json({
                error: 'Token expired',
                code: 'ERR_TOKEN_EXPIRED',
                path: req.path,
                message: 'Access token has expired. Please refresh your token.',
            });
        } else if (error instanceof JsonWebTokenError) {
            console.log('[AUTH_MIDDLEWARE] ERROR: Invalid token for', req.path, error.message);
            return res.status(403).json({
                error: 'Invalid token',
                code: 'ERR_INVALID_TOKEN',
                path: req.path,
                details: error.message,
            });
        } else {
            console.error('[AUTH_MIDDLEWARE] ERROR: Unexpected error for', req.path, error);
            return res.status(500).json({
                error: 'Authentication error',
                code: 'ERR_AUTH_ERROR',
                path: req.path,
            });
        }
    }
}
