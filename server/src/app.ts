import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import departmentRoutes from './routes/department.routes';
// import documentRoutes from './routes/document.routes';
import userRoutes from './routes/user.routes';
import { env } from './configs/env';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

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
// app.use('/documents', documentRoutes)


export default app;