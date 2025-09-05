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
import documentReviewRoutes from './routes/documentreview.routes'
import excelRoutes from './routes/excel.routes';
import { env } from './configs/env';
import path from 'path';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
// make uploads folder to be public
const uploadDir = path.join(__dirname, "..", "uploads");
app.use('/uploads', express.static(uploadDir));

app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
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


export default app;