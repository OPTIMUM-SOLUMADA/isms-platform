import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '@/routes/auth.routes';
import departmentRoutes from '@/routes/department.routes';
import documentRoutes from '@/routes/document.routes';
import userRoutes from '@/routes/user.routes';
import isoClauseRoutes from '@/routes/isoclause.route';
import documentTypeRoutes from '@/routes/documenttype.routes';
import documentReviewRoutes from '@/routes/documentreview.routes';
import excelRoutes from '@/routes/excel.routes';
import invitationRoutes from '@/routes/invitation.routes';
import ownerRoutes from '@/routes/owner.routes';
import departmentRoleRoutes from '@/routes/departmentrole.routes';
import googleDriveRoutes from '@/routes/googledrive.routes';
import versionRoutes from '@/routes/version.routes';
import pageRoutes from '@/routes/page.routes';
import { env } from '@/configs/env';
import { UPLOAD_PATH, UPLOAD_URL } from '@/configs/upload';
import { PUBLIC_PATH, VIEWS_PATH } from '@/configs/public';
import { sessionMiddleware } from '@/configs/session.config';
import { auditLogMiddleware } from './middlewares/auditlog.middleware';

const app = express();

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

// session
app.use(sessionMiddleware);

// Tell Express where views are and that we use EJS
app.set('views', VIEWS_PATH);
app.set('view engine', 'ejs');

// Public folder
app.use('/static', express.static(PUBLIC_PATH));

// make uploads folder to be public
app.use(UPLOAD_URL, express.static(UPLOAD_PATH));

app.use(cookieParser());
app.set('trust proxy', true);

// Audit middleware
app.use(auditLogMiddleware);

// Pages
app.use('/', pageRoutes);
// Google Drive
app.use('/google-drive', googleDriveRoutes);
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/iso-clauses', isoClauseRoutes);
app.use('/api/document-types', documentTypeRoutes);
app.use('/api/document-reviews', documentReviewRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/invitation', invitationRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/department-roles', departmentRoleRoutes);
app.use('/api/document-versions', versionRoutes);

export default app;
