import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import departmentRoutes from './routes/department.routes';
import documentRoutes from './routes/document.routes';
import userRoutes from './routes/user.routes';
import isoClauseRoutes from './routes/isoclause.route';
import documentTypeRoutes from './routes/documenttype.routes';
import documentReviewRoutes from './routes/documentreview.routes';
import excelRoutes from './routes/excel.routes';
import invitationRoutes from './routes/invitation.routes';
import ownerRoutes from './routes/owner.routes';
import departmentRoleRoutes from './routes/departmentrole.routes';
import { env } from './configs/env';
import { UPLOAD_PATH, UPLOAD_URL } from './configs/upload';
import { PUBLIC_PATH } from './configs/public';

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

// Public folder
app.use(express.static(PUBLIC_PATH));

// make uploads folder to be public
app.use(UPLOAD_URL, express.static(UPLOAD_PATH));

app.use(cookieParser());
app.set('trust proxy', true);

// Routes
app.use('/auth', authRoutes);
app.use('/departments', departmentRoutes);
app.use('/users', userRoutes);
app.use('/documents', documentRoutes);
app.use('/iso-clauses', isoClauseRoutes);
app.use('/document-types', documentTypeRoutes);
app.use('/document-reviews', documentReviewRoutes);
app.use('/excel', excelRoutes);
app.use('/invitation', invitationRoutes);
app.use('/owners', ownerRoutes);
app.use('/department-roles', departmentRoleRoutes);

export default app;
