
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '@/configs/env';
import { User } from '@prisma/client';

interface Payload extends JwtPayload {
    user: User
}

export class JwtService {

    generateAccessToken = (payload: User) => {
        const { passwordHash, ...rest } = payload;
        return jwt.sign({ user: rest }, env.JWT_ACCESS_SECRET, {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
            issuer: env.JWT_ISSUER
        });
    }

    generateRefreshToken = (user: User) => {
        const { passwordHash, ...rest } = user;
        return jwt.sign(
            { user: rest },
            env.JWT_REFRESH_SECRET,
            { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
        )
    }

    verifyToken = (token: string) => {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as Payload;
    }

    decode = (token: string) => {
        return jwt.decode(token);
    };
}