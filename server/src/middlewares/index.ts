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

    // -----------------------
    // CORS
    // -----------------------
    const allowedOrigins = [
        'http://localhost:5173', // local dev
        'https://isms-platform-a2dt.onrender.com', // deployed frontend
    ];

    app.use(
        cors({
            origin: (origin, callback) => {
                // allow requests with no origin (Postman, curl)
                if (!origin) return callback(null, true);

                if (allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error(`CORS not allowed from origin: ${origin}`));
                }
            },
            credentials: true, // allow cookies
            optionsSuccessStatus: 200,
            exposedHeaders: ['Authorization', 'Content-Disposition'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }),
    );

    // -----------------------
    // Session
    // -----------------------
    app.use(sessionMiddleware);

    // -----------------------
    // Views
    // -----------------------
    app.set('views', VIEWS_PATH);
    app.set('view engine', 'ejs');

    // -----------------------
    // Static
    // -----------------------
    app.use('/static', express.static(PUBLIC_PATH));
    app.use(UPLOAD_URL, express.static(UPLOAD_PATH));

    // -----------------------
    // Cookies
    // -----------------------
    app.use(cookieParser());
    app.set('trust proxy', true);

    // -----------------------
    // Audit log (global)
    // -----------------------
    app.use(auditLogMiddleware);
}
