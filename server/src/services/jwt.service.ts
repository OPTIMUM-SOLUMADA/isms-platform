import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '@/configs/env';
import { User } from '@prisma/client';

interface Payload extends JwtPayload {
    user: User;
}

export class JwtService {
    generateAccessToken = (payload: User) => {
        const { passwordHash, passwordResetToken, metadata, ...rest } = payload;
        return jwt.sign({ user: rest }, env.JWT_ACCESS_SECRET, {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
            issuer: env.JWT_ISSUER,
        });
    };

    // If isLongExpiration is true, it will return a long expiration token
    generateRefreshToken = (user: User, isLongExpiration = false) => {
        const { passwordHash, passwordResetToken, metadata, ...rest } = user;
        return jwt.sign({ user: rest }, env.JWT_REFRESH_SECRET, {
            expiresIn: (isLongExpiration
                ? env.JWT_REFRESH_LONG_EXPIRES_IN
                : env.JWT_REFRESH_SHORT_EXPIRES_IN) as any,
        });
    };

    verifyToken = (token: string) => {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as Payload;
    };

    verifyRefreshToken = (token: string) => {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as Payload;
    };

    generatePasswordResetToken(user: User) {
        const { passwordHash, passwordResetToken, metadata, ...rest } = user;
        return jwt.sign({ user: rest }, env.JWT_ACCESS_SECRET, {
            expiresIn: env.JWT_RESET_EXPIRES_IN as any,
            issuer: env.JWT_ISSUER,
        });
    }

    verifyPasswordResetToken = (token: string) => {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as Payload;
    };

    decode = (token: string) => {
        return jwt.decode(token);
    };
}
