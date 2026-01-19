import { JwtService } from '@/services/jwt.service';
import { RoleType } from '@/types/roles';
import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

const jwtService = new JwtService();

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const payload = jwtService.verifyToken(token);
        req.user = {
            id: payload.user.id,
            role: payload.user.role as RoleType | undefined
        };

        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.sendStatus(401);
        } else {
            return res.sendStatus(403);
        }
    }
}
