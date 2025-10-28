import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from './env';

export const sessionMiddleware = session({
    secret: env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: env.DATABASE_URL,
        collectionName: 'google-sessions',
        ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
});
