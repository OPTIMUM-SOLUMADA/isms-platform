import express from 'express';
import applyMiddleware from '@/middlewares';
import applyRoutes from '@/routes';

const app = express();

applyMiddleware(app);
applyRoutes(app);

export default app;
