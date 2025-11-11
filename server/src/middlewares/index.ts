import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { env } from '@/configs/env';
import { sessionMiddleware } from '@/configs/session.config';
import { auditLogMiddleware } from '@/middlewares/auditlog.middleware';
import { PUBLIC_PATH, VIEWS_PATH } from '@/configs/public';
import { UPLOAD_PATH, UPLOAD_URL } from '@/configs/upload';

export default function applyMiddleware(app: Application) {
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '50mb' }));

    // CORS
    app.use(
        cors({
            origin: env.CORS_ORIGIN,
            credentials: true,
            optionsSuccessStatus: 200,
            exposedHeaders: ['Authorization', 'Content-Disposition'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }),
    );

    // Session
    app.use(sessionMiddleware);

    // Views
    app.set('views', VIEWS_PATH);
    app.set('view engine', 'ejs');

    // Static
    app.use('/static', express.static(PUBLIC_PATH));
    app.use(UPLOAD_URL, express.static(UPLOAD_PATH));

    // Cookies
    app.use(cookieParser());
    app.set('trust proxy', true);

    // Audit log (global)
    app.use(auditLogMiddleware);
}
