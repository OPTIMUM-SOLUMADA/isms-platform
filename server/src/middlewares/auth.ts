import { JwtService } from '@/services/jwt.service';
import { Request, Response, NextFunction } from 'express';

const jwtService = new JwtService();

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    try {
        const payload = jwtService.verifyToken(token);
        req.user = payload.user;

        return next()
    } catch (error) {
        console.log(error);
        return res.sendStatus(403)
    }

}