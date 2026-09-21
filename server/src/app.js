import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware.js';
import { adminRouter } from './routes/admin.routes.js';
import { authRouter } from './routes/auth.routes.js';

export const app = express();

app.disable('x-powered-by');

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

app.use(notFoundHandler);
app.use(errorHandler);
