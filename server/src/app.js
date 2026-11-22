import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware.js';
import { adminRouter } from './routes/admin.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { classRouter } from './routes/class.routes.js';
import { productRouter } from './routes/product.routes.js';
import { studentRouter } from './routes/student.routes.js';
import { newsRouter } from './routes/news.routes.js';
import { noticeRouter } from './routes/notice.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use(cookieParser());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: '1mb',
  }),
);

app.get('/api/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/classes', classRouter);
app.use('/api/products', productRouter);
app.use('/api/students', studentRouter);
app.use('/api/news', newsRouter);
app.use('/api/notices', noticeRouter);

app.use(notFoundHandler);
app.use(errorHandler);
