import { Request, Response, NextFunction } from 'express';
import { env } from '@/configs/env';

/**
 * Diagnostic middleware to log authentication issues
 * Helps identify differences between local and production (Render) environments
 */
export function authDiagnosticMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const cookies = req.cookies;
    const environment = env.NODE_ENV;
    const origin = req.headers['origin'];
    const referer = req.headers['referer'];
    
    // Log authentication details for diagnostic purposes
    const diagnosticInfo = {
        timestamp: new Date().toISOString(),
        environment,
        method: req.method,
        path: req.path,
        origin,
        referer,
        hasAuthHeader: !!authHeader,
        authHeaderPrefix: authHeader ? authHeader.split(' ')[0] : null,
        tokenLength: authHeader ? authHeader.split(' ')[1]?.length : 0,
        hasRefreshToken: !!cookies?.refreshToken,
        refreshTokenLength: cookies?.refreshToken?.length || 0,
        cookies: Object.keys(cookies || {}),
        corsOrigin: env.CORS_ORIGIN,
        // Include first and last 10 chars of tokens for debugging (masked)
        accessTokenPreview: authHeader ? 
            `${authHeader.split(' ')[1]?.substring(0, 10)}...${authHeader.split(' ')[1]?.substring(authHeader.split(' ')[1]?.length - 10)}` : 
            null,
        refreshTokenPreview: cookies?.refreshToken ? 
            `${cookies.refreshToken.substring(0, 10)}...${cookies.refreshToken.substring(cookies.refreshToken.length - 10)}` : 
            null,
    };

    // Add diagnostic info to request for later use
    (req as any).authDiagnostic = diagnosticInfo;
    
    next();
}
