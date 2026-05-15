import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from './env';

const isProd = env.NODE_ENV === 'production';

export const sessionMiddleware = session({
    name: 'isms.sid',
    secret: env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,

    proxy: true,
    store: MongoStore.create({
        mongoUrl: env.DATABASE_URL,
        collectionName: 'google-sessions',
        ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax', // 🔥 FIX CLÉ
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
});
